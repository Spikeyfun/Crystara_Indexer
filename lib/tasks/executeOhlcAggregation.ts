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

  const pairs = await sqliteDb.pair.findMany({
    where: { network },
    include: { token0: true, token1: true },
  });

  if (pairs.length === 0) {
    logger.info(`[${network}] No pairs found in local DB to process.`);
    return;
  }

  logger.info(`[${network}] Found ${pairs.length} pairs to process for local 1m aggregation.`);

  for (const pair of pairs) {
    try {
      const lastOhlc = await sqliteDb.ohlcData.findFirst({
        where: {
          network,
          token0Address: pair.token0.address,
          token1Address: pair.token1.address,
          timeframe: timeframe,
        },
        orderBy: {
          timestamp: 'desc',
        },
      });

      let startTime: Date;
      if (lastOhlc) {
        startTime = new Date(lastOhlc.timestamp);
        startTime.setMinutes(startTime.getMinutes() + 1);
      } else {
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
        continue;
      }

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

      const { token0, token1 } = pair;
      const normalize = (amount: bigint, decimals: number) => {
          if (decimals < 0) return 0; // Avoid issues with invalid decimal values
          return Number(amount) / (10 ** decimals);
      };

      

      const unifiedSwaps = [
        ...dexlynSwaps.map(s => {
            let price: number;
            let volume: number;

            if (s.xIn > 0) { // User gives token0 (xIn), gets token1 (yOut)
                price = normalize(s.yOut, token1.decimals) / normalize(s.xIn, token0.decimals);
                volume = normalize(s.xIn, token0.decimals);
            } else { // User gives token1 (yIn), gets token0 (xOut)
                price = normalize(s.yIn, token1.decimals) / normalize(s.xOut, token0.decimals);
                volume = normalize(s.xOut, token0.decimals);
            }

            return {
                ammSource: 'DexlynSwap',
                blockTimestamp: s.blockTimestamp,
                price: price,
                volume: volume
            };
        }),
        ...spikeySwaps.map(s => {
            let price: number;
            let volume: number;

            if (s.amount0In > 0) { // User gives token0 (amount0In), gets token1 (amount1Out)
                price = normalize(s.amount1Out, token1.decimals) / normalize(s.amount0In, token0.decimals);
                volume = normalize(s.amount0In, token0.decimals);
            } else { // User gives token1 (amount1In), gets token0 (amount0Out)
                price = normalize(s.amount1In, token1.decimals) / normalize(s.amount0Out, token0.decimals);
                volume = normalize(s.amount0Out, token0.decimals);
            }

            return {
                ammSource: 'SpikeySwap',
                blockTimestamp: s.blockTimestamp,
                price: price,
                volume: volume
            };
        }),
      ].filter(s => s.price > 0 && isFinite(s.price));

      const newSwaps = unifiedSwaps.sort((a, b) => a.blockTimestamp.getTime() - b.blockTimestamp.getTime());

      if (newSwaps.length === 0) {
        continue;
      }

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
          const prices = ammSwaps.map(s => s.price);
          const totalVolume = ammSwaps.reduce((sum, s) => sum + s.volume, 0);

          const ohlc = {
            open: prices[0],
            high: Math.max(...prices),
            low: Math.min(...prices),
            close: prices[prices.length - 1],
            volume: new Prisma.Decimal(totalVolume),
            tradeCount: ammSwaps.length,
          };

          upsertPromises.push(sqliteDb.ohlcData.upsert({
            where: {
              // Usamos el nuevo índice único definido en el schema de SQLite
              network_ammSource_token0Address_token1Address_timeframe_timestamp: {
                network,
                ammSource,
                token0Address: pair.token0.address, // <-- Clave natural
                token1Address: pair.token1.address, // <-- Clave natural
                timeframe,
                timestamp,
              },
            },
            update: ohlc,
            create: {
              network,
              ammSource,
              timeframe,
              timestamp,
              token0Address: pair.token0.address, // <-- Clave natural
              token1Address: pair.token1.address, // <-- Clave natural
              ...ohlc,
            },
          }));
        }
      }


      if (upsertPromises.length > 0) {
        await sqliteDb.$transaction(upsertPromises); // Use sqliteDb transaction
      }
    } catch (error) {
      logger.error(`[${network}] Failed to process pair ${pair.id} for local 1m aggregation:`, error);
    }
  }
}
