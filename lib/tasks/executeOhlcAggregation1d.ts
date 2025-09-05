import { supabaseDb } from '@/lib/prismadb';
import { createLogger } from '@/app/indexer/utils';
import { Prisma as SupabasePrisma, OhlcData } from '@/prisma/generated/supabase';
const logger = createLogger('ohlc-aggregator-1d');

function roundTimestampToInterval(timestamp: Date): Date {
  const date = new Date(timestamp);
  date.setUTCHours(0, 0, 0, 0); // Round down to the beginning of the UTC day
  return date;
}

export async function executeOhlcAggregation1d(network: string) {
  const inputTimeframe = '1h';
  const outputTimeframe = '1d';
  logger.info(`[${network}] Starting 1d OHLC aggregation (Supabase -> Supabase)`);

  const distinctPairs = await supabaseDb.ohlcData.findMany({
    where: { network, timeframe: inputTimeframe },
    distinct: ['token0Address', 'token1Address'],
    select: {
      token0Address: true,
      token1Address: true,
    },
  });

  if (distinctPairs.length === 0) {
    logger.info(`[${network}] No pairs with 1h data found in Supabase to process for 1d aggregation.`);
    return;
  }
  
  logger.info(`[${network}] Found ${distinctPairs.length} distinct pairs with 1h data to process.`);

  for (const ohlcPair of distinctPairs) {
    try {
      const { token0Address, token1Address } = ohlcPair;

      const lastOhlc1d = await supabaseDb.ohlcData.findFirst({
        where: { network, token0Address, token1Address, timeframe: outputTimeframe },
        orderBy: { timestamp: 'desc' },
      });

      let startTime: Date;
      if (lastOhlc1d) {
        startTime = new Date(lastOhlc1d.timestamp);
        startTime.setUTCDate(startTime.getUTCDate() + 1);
      } else {
        const earliest1hOhlc = await supabaseDb.ohlcData.findFirst({
          where: { network, token0Address, token1Address, timeframe: inputTimeframe },
          orderBy: { timestamp: 'asc' },
          select: { timestamp: true },
        });

        if (!earliest1hOhlc) {
          logger.info(`[${network}] No 1h OHLC data in Supabase for pair ${token0Address}/${token1Address}. Skipping.`);
          continue;
        }
        startTime = roundTimestampToInterval(earliest1hOhlc.timestamp);
      }

      if (startTime.getTime() > new Date().getTime()) continue;


      const ohlc1hData = await supabaseDb.ohlcData.findMany({
        where: {
          network,
          token0Address,
          token1Address,
          timeframe: inputTimeframe,
          timestamp: { gte: startTime },
        },
        orderBy: { timestamp: 'asc' },
      });

      if (ohlc1hData.length === 0) continue;

      logger.info(`[${network}] Found ${ohlc1hData.length} 1h records in Supabase for pair ${token0Address}/${token1Address}.`);

      const ohlcByDay = ohlc1hData.reduce((acc, ohlc) => {
        const key = roundTimestampToInterval(ohlc.timestamp).toISOString();
        if (!acc[key]) acc[key] = [];
        acc[key].push(ohlc);
        return acc;
      }, {} as Record<string, OhlcData[]>);

      const upsertPromises = [];

      for (const timestampKey in ohlcByDay) {
        const intervalData = ohlcByDay[timestampKey];
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

          logger.info(`[${network}] Preparing 1d OHLC upsert for pair ${token0Address}/${token1Address} from ${ammSource} at ${timestamp.toISOString()}`);

          upsertPromises.push(supabaseDb.ohlcData.upsert({
            where: {
              network_ammSource_token0Address_token1Address_timeframe_timestamp: {
                network,
                ammSource,
                token0Address,
                token1Address,
                timeframe: outputTimeframe,
                timestamp,
              }
            },
            update: ohlc,
            create: {
              network,
              ammSource,
              token0Address,
              token1Address,
              timeframe: outputTimeframe,
              timestamp,
              ...ohlc
            },
          }));
      }
    }

    if (upsertPromises.length > 0) {
      await supabaseDb.$transaction(upsertPromises);
    }
  } catch (error) {
    logger.error(`[${network}] Failed to process pair ${ohlcPair.token0Address}/${ohlcPair.token1Address} for 1d aggregation:`, error);
  }
}
}