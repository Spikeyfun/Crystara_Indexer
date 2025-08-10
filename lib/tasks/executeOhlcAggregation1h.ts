import { supabaseDb } from '@/lib/prismadb';
import { createLogger } from '@/app/indexer/utils';
import { Prisma as SupabasePrisma, OhlcData } from '@/generated/supabase/client';

const logger = createLogger('ohlc-aggregator-1h');

function roundTimestampToInterval(timestamp: Date): Date {
  const date = new Date(timestamp);
  date.setMinutes(0, 0, 0); // Round down to the beginning of the hour
  return date;
}

export async function executeOhlcAggregation1h(network: string) {
  const inputTimeframe = '5m';
  const outputTimeframe = '1h';
  logger.info(`[${network}] Starting 1h OHLC aggregation (Supabase -> Supabase)`);

  const pairs = await supabaseDb.pair.findMany({ where: { network } });

  if (pairs.length === 0) {
    logger.info(`[${network}] No pairs found in Supabase to process for 1h aggregation.`);
    return;
  }

  for (const pair of pairs) {
    try {
      const lastOhlc1h = await supabaseDb.ohlcData.findFirst({
        where: { network, pairId: pair.id, timeframe: outputTimeframe },
        orderBy: { timestamp: 'desc' },
      });

      let startTime: Date;
      if (lastOhlc1h) {
        startTime = new Date(lastOhlc1h.timestamp);
        startTime.setHours(startTime.getHours() + 1);
      } else {
        const earliest5mOhlc = await supabaseDb.ohlcData.findFirst({
          where: { pairId: pair.id, network, timeframe: inputTimeframe },
          orderBy: { timestamp: 'asc' },
          select: { timestamp: true },
        });

        if (!earliest5mOhlc) {
          logger.info(`[${network}] No 5m OHLC data in Supabase for pair ${pair.id}. Skipping.`);
          continue;
        }
        startTime = roundTimestampToInterval(earliest5mOhlc.timestamp);
      }

      const now = new Date();
      if (startTime.getTime() > now.getTime()) continue;

      logger.info(`[${network}] Pair ${pair.id}: Reading 5m data from Supabase from ${startTime.toISOString()}`);

      const ohlc5mData = await supabaseDb.ohlcData.findMany({
        where: {
          pairId: pair.id,
          network,
          timeframe: inputTimeframe,
          timestamp: { gte: startTime },
        },
        orderBy: { timestamp: 'asc' },
      });

      if (ohlc5mData.length === 0) continue;

      logger.info(`[${network}] Found ${ohlc5mData.length} 5m records in Supabase for pair ${pair.id}.`);

      const ohlcByHour = ohlc5mData.reduce((acc, ohlc) => {
        const key = roundTimestampToInterval(ohlc.timestamp).toISOString();
        if (!acc[key]) acc[key] = [];
        acc[key].push(ohlc);
        return acc;
      }, {} as Record<string, OhlcData[]>);

      const upsertPromises = [];

      for (const timestampKey in ohlcByHour) {
        const intervalData = ohlcByHour[timestampKey];
        const timestamp = new Date(timestampKey);

        const ohlcByAmm = intervalData.reduce((acc, ohlc) => {
          if (!acc[ohlc.ammSource]) acc[ohlc.ammSource] = [];
          acc[ohlc.ammSource].push(ohlc);
          return acc;
        }, {} as Record<string, OhlcData[]>);

        for (const ammSource in ohlcByAmm) {
          const ammOhlcData = ohlcByAmm[ammSource];

          const open = ammOhlcData[0].open;
          const close = ammOhlcData[ammOhlcData.length - 1].close;
          const high = ammOhlcData.map(o => o.high).sort((a, b) => b.comparedTo(a))[0];
          const low = ammOhlcData.map(o => o.low).sort((a, b) => a.comparedTo(b))[0];
          const volume = ammOhlcData.reduce((sum, o) => sum.add(o.volume), new SupabasePrisma.Decimal(0));
          const tradeCount = ammOhlcData.reduce((sum, o) => sum + o.tradeCount, 0);

          const ohlc = { open, high, low, close, volume, tradeCount };

          logger.info(`[${network}] Preparing 1h OHLC upsert for pair ${pair.id} from ${ammSource} at ${timestamp.toISOString()}`);

          upsertPromises.push(supabaseDb.ohlcData.upsert({
            where: { network_ammSource_pairId_timeframe_timestamp: { network, ammSource, pairId: pair.id, timeframe: outputTimeframe, timestamp } },
            update: ohlc,
            create: { network, ammSource, pairId: pair.id, timeframe: outputTimeframe, timestamp, ...ohlc },
          }));
        }
      }

      if (upsertPromises.length > 0) {
        logger.info(`[${network}] Executing batch upsert of ${upsertPromises.length} 1h OHLC records to Supabase for pair ${pair.id}.`);
        await supabaseDb.$transaction(upsertPromises);
      }
    } catch (error) {
      logger.error(`[${network}] Failed to process pair ${pair.id} for 1h aggregation:`, error);
    }
  }
}
