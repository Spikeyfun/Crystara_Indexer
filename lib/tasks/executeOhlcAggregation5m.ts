import { sqliteDb, supabaseDb } from '@/lib/prismadb';
import { createLogger } from '@/app/indexer/utils';
import { Prisma as SupabasePrisma } from '@/generated/supabase/client';
import { OhlcData as SqliteOhlcData } from '@/generated/sqlite/client';

const logger = createLogger('ohlc-aggregator-5m-remote');

function roundTimestampToInterval(timestamp: Date): Date {
  const date = new Date(timestamp);
  date.setSeconds(0, 0);
  date.setMinutes(Math.floor(date.getMinutes() / 5) * 5);
  return date;
}

export async function executeOhlcAggregation5m(network: string) {
  const timeframe = '5m';
  logger.info(`[${network}] Starting 5m OHLC aggregation (SQLite -> Supabase)`);

  const pairs = await supabaseDb.pair.findMany({ where: { network } });

  if (pairs.length === 0) {
    logger.info(`[${network}] No pairs found in Supabase to process for 5m aggregation.`);
    return;
  }

  for (const pair of pairs) {
    try {
      const lastOhlc5m = await supabaseDb.ohlcData.findFirst({
        where: { network, pairId: pair.id, timeframe },
        orderBy: { timestamp: 'desc' },
      });

      let startTime: Date;
      if (lastOhlc5m) {
        startTime = new Date(lastOhlc5m.timestamp);
        startTime.setMinutes(startTime.getMinutes() + 5);
      } else {
        const earliest1mOhlc = await sqliteDb.ohlcData.findFirst({
          where: { pairId: pair.id, network, timeframe: '1m' },
          orderBy: { timestamp: 'asc' },
          select: { timestamp: true },
        });

        if (!earliest1mOhlc) {
          logger.info(`[${network}] No 1m OHLC data in SQLite for pair ${pair.id}. Skipping.`);
          continue;
        }
        startTime = roundTimestampToInterval(earliest1mOhlc.timestamp);
      }

      const now = new Date();
      if (startTime.getTime() > now.getTime()) continue;

      logger.info(`[${network}] Pair ${pair.id}: Reading 1m data from SQLite from ${startTime.toISOString()}`);

      const ohlc1mData = await sqliteDb.ohlcData.findMany({
        where: {
          pairId: pair.id,
          network,
          timeframe: '1m',
          timestamp: { gte: startTime },
        },
        orderBy: { timestamp: 'asc' },
      });

      if (ohlc1mData.length === 0) continue;

      logger.info(`[${network}] Found ${ohlc1mData.length} 1m records in SQLite for pair ${pair.id}.`);

      const ohlcBy5m = ohlc1mData.reduce((acc, ohlc) => {
        const key = roundTimestampToInterval(ohlc.timestamp).toISOString();
        if (!acc[key]) acc[key] = [];
        acc[key].push(ohlc);
        return acc;
      }, {} as Record<string, SqliteOhlcData[]>);

      const upsertPromises = [];

      for (const timestampKey in ohlcBy5m) {
        const intervalData = ohlcBy5m[timestampKey];
        const timestamp = new Date(timestampKey);

        const ohlcByAmm = intervalData.reduce((acc, ohlc) => {
          if (!acc[ohlc.ammSource]) acc[ohlc.ammSource] = [];
          acc[ohlc.ammSource].push(ohlc);
          return acc;
        }, {} as Record<string, SqliteOhlcData[]>);

        for (const ammSource in ohlcByAmm) {
          const ammOhlcData = ohlcByAmm[ammSource];

          const open = ammOhlcData[0].open;
          const close = ammOhlcData[ammOhlcData.length - 1].close;
          const high = ammOhlcData.map(o => o.high).sort((a, b) => b.comparedTo(a))[0];
          const low = ammOhlcData.map(o => o.low).sort((a, b) => a.comparedTo(b))[0];
          const volume = ammOhlcData.reduce((sum, o) => sum.add(o.volume), new SupabasePrisma.Decimal(0));
          const tradeCount = ammOhlcData.reduce((sum, o) => sum + o.tradeCount, 0);

          const ohlc = {
            open: new SupabasePrisma.Decimal(open.toString()),
            high: new SupabasePrisma.Decimal(high.toString()),
            low: new SupabasePrisma.Decimal(low.toString()),
            close: new SupabasePrisma.Decimal(close.toString()),
            volume,
            tradeCount,
          };

          logger.info(`[${network}] Preparing 5m OHLC upsert for pair ${pair.id} from ${ammSource} at ${timestamp.toISOString()}`);

          upsertPromises.push(supabaseDb.ohlcData.upsert({
            where: { network_ammSource_pairId_timeframe_timestamp: { network, ammSource, pairId: pair.id, timeframe, timestamp } },
            update: ohlc,
            create: { network, ammSource, pairId: pair.id, timeframe, timestamp, ...ohlc },
          }));
        }
      }

      if (upsertPromises.length > 0) {
        logger.info(`[${network}] Executing batch upsert of ${upsertPromises.length} 5m OHLC records to Supabase for pair ${pair.id}.`);
        await supabaseDb.$transaction(upsertPromises);
      }
    } catch (error) {
      logger.error(`[${network}] Failed to process pair ${pair.id} for 5m aggregation:`, error);
    }
  }
}
