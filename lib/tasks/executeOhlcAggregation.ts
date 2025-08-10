import { sqliteDb } from '@/lib/prismadb';
import { createLogger } from '@/app/indexer/utils';
import { Prisma } from '@/generated/sqlite';

const logger = createLogger('ohlc-aggregator-1m-local');

// Helper function to round a timestamp down to the nearest minute
function roundTimestampToInterval(timestamp: Date): Date {
  const date = new Date(timestamp);
  date.setSeconds(0, 0);
  return date;
}

export async function executeOhlcAggregation1mLocal(network: string) {
  const timeframe = '1m';
  logger.info(`[${network}] Starting LOCAL OHLC aggregation for timeframe: ${timeframe}`);

  // 1. Get all pairs for the current network from the local SQLite DB.
  const pairs = await sqliteDb.pair.findMany({
    where: { network },
    include: { token0: true, token1: true }, // Include tokens for decimal normalization
  });

  if (pairs.length === 0) {
    logger.info(`[${network}] No pairs found in local DB to process.`);
    return;
  }

  logger.info(`[${network}] Found ${pairs.length} pairs to process for local 1m aggregation.`);

  for (const pair of pairs) {
    try {
      // 3. Find the last 1m candle we calculated for this pair locally.
      const lastOhlc = await sqliteDb.ohlcData.findFirst({
        where: {
          network,
          pairId: pair.id,
          timeframe: timeframe,
        },
        orderBy: {
          timestamp: 'desc',
        },
      });

      let startTime: Date;
      if (lastOhlc) {
        // Start from the next minute
        startTime = new Date(lastOhlc.timestamp);
        startTime.setMinutes(startTime.getMinutes() + 1);
      } else {
        // If no last OHLC, find the earliest swap for this pair
        const earliestSwap = await sqliteDb.dexlynSwap.findFirst({
          where: { pairId: pair.id },
          orderBy: { blockTimestamp: 'asc' },
          select: { blockTimestamp: true }
        });
        const earliestSpikeySwap = await sqliteDb.spikeyAmmSwap.findFirst({
          where: { pairId: pair.id },
          orderBy: { blockTimestamp: 'asc' },
          select: { blockTimestamp: true }
        });
        const earliestTimestamp = earliestSwap && earliestSpikeySwap
          ? new Date(Math.min(earliestSwap.blockTimestamp.getTime(), earliestSpikeySwap.blockTimestamp.getTime()))
          : earliestSwap ? earliestSwap.blockTimestamp : earliestSpikeySwap ? earliestSpikeySwap.blockTimestamp : null;

        startTime = earliestTimestamp ? roundTimestampToInterval(earliestTimestamp) : new Date(0);
      }

      const now = new Date();
      if (startTime.getTime() > now.getTime()) {
        logger.info(`[${network}] Skipping pair ${pair.id}: startTime ${startTime.toISOString()} is in the future.`);
        continue;
      }

      logger.info(`[${network}] Processing pair ${pair.id}. Starting from: ${startTime.toISOString()}`);

      // Fetch all swaps since the last processed timestamp
      const [dexlynSwaps, spikeySwaps] = await Promise.all([
        sqliteDb.dexlynSwap.findMany({
          where: {
            pairId: pair.id,
            blockTimestamp: { gt: startTime },
          },
        }),
        sqliteDb.spikeyAmmSwap.findMany({
          where: {
            pairId: pair.id,
            blockTimestamp: { gt: startTime },
          },
        }),
      ]);

      const unifiedSwaps = [
        ...dexlynSwaps.map(s => ({ ...s, ammSource: 'DexlynSwap', amount0In: s.xIn, amount1In: s.yIn, amount0Out: s.xOut, amount1Out: s.yOut })),
        ...spikeySwaps.map(s => ({ ...s, ammSource: 'SpikeySwap' })),
      ];

      const newSwaps = unifiedSwaps.sort((a, b) => a.blockTimestamp.getTime() - b.blockTimestamp.getTime());

      if (newSwaps.length === 0) {
        continue; // No new swaps, move to the next pair
      }

      logger.info(`[${network}] Found ${newSwaps.length} new swaps for pair ${pair.id}.`);

      const swapsByMinute = newSwaps.reduce((acc, swap) => {
        const minuteTimestamp = roundTimestampToInterval(swap.blockTimestamp);
        const key = minuteTimestamp.toISOString();
        if (!acc[key]) acc[key] = [];
        acc[key].push(swap);
        return acc;
      }, {} as Record<string, typeof newSwaps>);

      const upsertPromises = [];

      for (const timestampKey in swapsByMinute) {
        const minuteSwaps = swapsByMinute[timestampKey];
        const timestamp = new Date(timestampKey);

        const swapsByAmm = minuteSwaps.reduce((acc, swap) => {
          if (!acc[swap.ammSource]) acc[swap.ammSource] = [];
          acc[swap.ammSource].push(swap);
          return acc;
        }, {} as Record<string, typeof minuteSwaps>);

        for (const ammSource in swapsByAmm) {
          const ammSwaps = swapsByAmm[ammSource];

          const processedSwaps = ammSwaps.map(swap => {
            const { token0, token1 } = pair;
            const normalize = (amount: bigint, decimals: number) => Number(amount) / (10 ** decimals);

            let price = 0;
            let volume = 0;

            if (swap.amount0In > 0) {
              const normalizedAmount0In = normalize(swap.amount0In, token0.decimals);
              const normalizedAmount1Out = normalize(swap.amount1Out, token1.decimals);
              if (normalizedAmount0In > 0) price = normalizedAmount1Out / normalizedAmount0In;
              volume = normalizedAmount1Out;
            } else if (swap.amount1In > 0) {
              const normalizedAmount1In = normalize(swap.amount1In, token1.decimals);
              const normalizedAmount0Out = normalize(swap.amount0Out, token0.decimals);
              if (normalizedAmount0Out > 0) price = normalizedAmount1In / normalizedAmount0Out;
              volume = normalizedAmount1In;
            }

            return { price, volume };
          }).filter(s => s.price > 0 && isFinite(s.price));

          if (processedSwaps.length === 0) continue;

          const prices = processedSwaps.map(s => s.price);
          const totalVolume = processedSwaps.reduce((sum, s) => sum + s.volume, 0);

          const ohlc = {
            open: prices[0],
            high: Math.max(...prices),
            low: Math.min(...prices),
            close: prices[prices.length - 1],
            volume: new Prisma.Decimal(totalVolume),
            tradeCount: processedSwaps.length,
          };

          logger.info(`[${network}] Preparing LOCAL OHLC upsert for pair ${pair.id} from ${ammSource} at ${timestamp.toISOString()}`);

          upsertPromises.push(sqliteDb.ohlcData.upsert({
            where: {
              network_ammSource_pairId_timeframe_timestamp: {
                network,
                ammSource,
                pairId: pair.id,
                timeframe,
                timestamp,
              },
            },
            update: ohlc,
            create: {
              network,
              ammSource,
              pairId: pair.id,
              timeframe,
              timestamp,
              ...ohlc,
            },
          }));
        }
      }

      if (upsertPromises.length > 0) {
        logger.info(`[${network}] Executing batch upsert of ${upsertPromises.length} LOCAL OHLC records for pair ${pair.id}.`);
        await sqliteDb.$transaction(upsertPromises);
      }
    } catch (error) {
      logger.error(`[${network}] Failed to process pair ${pair.id} for local 1m aggregation:`, error);
    }
  }
}