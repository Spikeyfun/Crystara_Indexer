import { sqliteDb, supabaseDb } from '@/lib/prismadb';
import { createLogger } from '@/app/indexer/utils';
import { Prisma as SupabasePrisma } from '@/prisma/app/generated/prisma';
import { OhlcData as SqliteOhlcData } from '@/generated/sqlite/client';

const logger = createLogger('ohlc-aggregator-5m');

function roundTimestampToInterval(timestamp: Date): Date {
  const date = new Date(timestamp);
  date.setSeconds(0, 0);
  date.setMinutes(Math.floor(date.getMinutes() / 5) * 5);
  return date;
}

export async function executeOhlcAggregation5m(network: string) {
  const inputTimeframe = '1m';
  const outputTimeframe = '5m';
  logger.info(`[${network}] Starting 5m OHLC aggregation (SQLite -> Supabase)`);

  const distinctPairs = await sqliteDb.ohlcData.findMany({
    where: { network, timeframe: inputTimeframe },
    distinct: ['token0Address', 'token1Address'],
    select: { token0Address: true, token1Address: true },
  });

  if (distinctPairs.length === 0) {
    logger.info(`[${network}] No pairs with 1m data found in SQLite to process.`);
    return;
  }
  logger.info(`[${network}] Found ${distinctPairs.length} distinct pairs in SQLite to process.`);

  for (const ohlcPair of distinctPairs) {
    try {
      const { token0Address, token1Address } = ohlcPair;

      const lastOhlc5m = await supabaseDb.ohlcData.findFirst({
        where: { network, token0Address, token1Address, timeframe: outputTimeframe },
        orderBy: { timestamp: 'desc' },
      });

      let startTime: Date;
      if (lastOhlc5m) {
        startTime = new Date(lastOhlc5m.timestamp);
        startTime.setMinutes(startTime.getMinutes() + 5);
      } else {
        const earliest1mOhlc = await sqliteDb.ohlcData.findFirst({
          where: { network, token0Address, token1Address, timeframe: inputTimeframe },
          orderBy: { timestamp: 'asc' },
          select: { timestamp: true },
        });

        if (!earliest1mOhlc) continue;
        startTime = roundTimestampToInterval(earliest1mOhlc.timestamp);
      }

      if (startTime.getTime() > new Date().getTime()) continue;

      const ohlc1mData = await sqliteDb.ohlcData.findMany({
        where: { network, token0Address, token1Address, timeframe: inputTimeframe, timestamp: { gte: startTime } },
        orderBy: { timestamp: 'asc' },
      });

      if (ohlc1mData.length === 0) continue;

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
          const ohlc = { open, high, low, close, volume, tradeCount };

          upsertPromises.push(supabaseDb.ohlcData.upsert({
            where: {
              network_ammSource_token0Address_token1Address_timeframe_timestamp: { 
                  network, ammSource, token0Address, token1Address, timeframe: outputTimeframe, timestamp 
                } 
            },
            update: ohlc,
            // ===== ¡LA FORMA CORRECTA Y SIMPLE! =====
            // Le pasamos solo los datos calculados.
            // TypeScript se queja porque cree que faltan campos del schema ANTIGUO.
            // El siguiente paso arreglará la percepción de TypeScript.
            create: {
              network,
              ammSource,
              token0Address,
              token1Address,
              timeframe: outputTimeframe,
              timestamp,
              ...ohlc,
            },
          }));
        }
      }

      if (upsertPromises.length > 0) {
        await supabaseDb.$transaction(upsertPromises);
      }
    } catch (error) {
      logger.error(`[${network}] Failed to process pair ${ohlcPair.token0Address}/${ohlcPair.token1Address} for 5m aggregation:`, error);
    }
  }
}