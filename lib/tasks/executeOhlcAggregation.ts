import { sqliteDb, supabaseDb } from '@/lib/prismadb';
import { createLogger } from '@/app/indexer/utils';
import { Prisma } from '@/generated/sqlite';

const logger = createLogger('ohlc-aggregator');

// Define the timeframes we want to aggregate
const TIMEFRAMES = ['1m'/*, '5m', '15m', '1h', '4h', '1d', '1w'*/];

// Helper function to round a timestamp down to the nearest interval
function roundTimestampToInterval(timestamp: Date, interval: string): Date {
  const date = new Date(timestamp);
  date.setSeconds(0, 0); // Always start from the beginning of the minute

  switch (interval) {
    case '1m':
      // Already rounded to minute
      break;
    case '5m':
      date.setMinutes(Math.floor(date.getMinutes() / 5) * 5);
      break;
    case '15m':
      date.setMinutes(Math.floor(date.getMinutes() / 15) * 15);
      break;
    case '1h':
      date.setHours(Math.floor(date.getHours() / 1) * 1);
      date.setMinutes(0);
      break;
    case '4h':
      date.setHours(Math.floor(date.getHours() / 4) * 4);
      date.setMinutes(0);
      break;
    case '1d':
      date.setHours(0, 0, 0, 0);
      break;
    case '1w':
      // Round to the start of the week (Monday 00:00:00 UTC)
      const day = date.getUTCDay(); // 0 for Sunday, 1 for Monday, ..., 6 for Saturday
      const diff = date.getUTCDate() - day + (day === 0 ? -6 : 1); // Adjust to Monday
      date.setUTCDate(diff);
      date.setUTCHours(0, 0, 0, 0);
      break;
    default:
      throw new Error(`Unsupported interval: ${interval}`);
  }
  return date;
}

export async function executeOhlcAggregation(network: string) {
  logger.info(`[${network}] Starting OHLC aggregation for all timeframes.`);

  // 1. Obtener todos los pares para la red actual.
  const pairs = await supabaseDb.pair.findMany({ // Fetch pairs from Supabase as they are the source for OHLC
    where: { network },
  });

  if (pairs.length === 0) {
    logger.info(`[${network}] No pairs found to process.`);
    return;
  }

  logger.info(`[${network}] Found ${pairs.length} pairs to process.`);

  // Iterate through each timeframe
  for (const timeframe of TIMEFRAMES) {
    logger.info(`[${network}] Processing timeframe: ${timeframe}`);

    // 2. Procesar cada par uno por uno.
    for (const pair of pairs) {
      try {
        // 3. Encontrar la última vela que calculamos para este par y timeframe.
        const lastOhlc = await supabaseDb.ohlcData.findFirst({
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
          // Start from the next interval after the last OHLC candle
          startTime = new Date(lastOhlc.timestamp);
          // Increment by the interval to get the start of the next candle
          // This logic needs to be precise for each interval
          switch (timeframe) {
            case '1m':
              startTime.setMinutes(startTime.getMinutes() + 1);
              break;
            case '5m':
              startTime.setMinutes(startTime.getMinutes() + 5);
              break;
            case '15m':
              startTime.setMinutes(startTime.getMinutes() + 15);
              break;
            case '1h':
              startTime.setHours(startTime.getHours() + 1);
              break;
            case '4h':
              startTime.setHours(startTime.getHours() + 4);
              break;
            case '1d':
              startTime.setDate(startTime.getDate() + 1);
              break;
            case '1w':
              startTime.setDate(startTime.getDate() + 7);
              break;
          }
        } else {
          // If no last OHLC, start from the beginning of the current interval for the earliest swap
          // For 1m, we fetch from the earliest swap. For others, we fetch from earliest 1m OHLC.
          if (timeframe === '1m') {
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

            startTime = earliestTimestamp ? roundTimestampToInterval(earliestTimestamp, '1m') : new Date(0);
          } else {
            const earliest1mOhlc = await supabaseDb.ohlcData.findFirst({
              where: { pairId: pair.id, timeframe: '1m' },
              orderBy: { timestamp: 'asc' },
              select: { timestamp: true }
            });
            startTime = earliest1mOhlc ? roundTimestampToInterval(earliest1mOhlc.timestamp, timeframe) : new Date(0);
          }
        }

        // Ensure startTime is not in the future
        const now = new Date();
        now.setSeconds(0, 0); // Round current time to minute for comparison
        if (startTime.getTime() > now.getTime()) {
          logger.info(`[${network}] Skipping pair ${pair.id} for timeframe ${timeframe}: startTime ${startTime.toISOString()} is in the future.`);
          continue;
        }

        logger.info(`[${network}] Processing pair ${pair.id} for timeframe ${timeframe}. Starting from: ${startTime.toISOString()}`);

        let dataToAggregate: any[] = [];

        if (timeframe === '1m') {
          // Existing logic for 1m candles from swaps
          const [dexlynSwaps, spikeySwaps] = await Promise.all([
            sqliteDb.dexlynSwap.findMany({
              where: {
                pairId: pair.id,
                blockTimestamp: { gt: startTime },
              },
              include: { pair: { include: { token0: true, token1: true } } },
            }),
            sqliteDb.spikeyAmmSwap.findMany({
              where: {
                pairId: pair.id,
                blockTimestamp: { gt: startTime },
              },
              include: { pair: { include: { token0: true, token1: true } } },
            }),
          ]);

          const unifiedSwaps = [
            ...dexlynSwaps.map(s => ({
              ...s,
              ammSource: 'DexlynSwap',
              amount0In: s.xIn,
              amount1In: s.yIn,
              amount0Out: s.xOut,
              amount1Out: s.yOut,
            })),
            ...spikeySwaps.map(s => ({
              ...s,
              ammSource: 'SpikeySwap',
            })),
          ];

          const newSwaps = unifiedSwaps.sort((a, b) => a.blockTimestamp.getTime() - b.blockTimestamp.getTime());

          if (newSwaps.length === 0) {
            logger.info(`[${network}] No new swaps for pair ${pair.id} for 1m timeframe.`);
            continue;
          }

          logger.info(`[${network}] Found ${newSwaps.length} new swaps for pair ${pair.id} for 1m timeframe.`);

          const swapsByMinute = newSwaps.reduce((acc, swap) => {
            const minuteTimestamp = roundTimestampToInterval(swap.blockTimestamp, '1m');
            const key = minuteTimestamp.toISOString();
            if (!acc[key]) {
              acc[key] = [];
            }
            acc[key].push(swap);
            return acc;
          }, {} as Record<string, typeof newSwaps>);

          const upsertPromises = [];

          for (const timestampKey in swapsByMinute) {
            const minuteSwaps = swapsByMinute[timestampKey];
            const timestamp = new Date(timestampKey);

            // Group swaps by their AMM source
            const swapsByAmm = minuteSwaps.reduce((acc, swap) => {
              if (!acc[swap.ammSource]) {
                acc[swap.ammSource] = [];
              }
              acc[swap.ammSource].push(swap);
              return acc;
            }, {} as Record<string, typeof minuteSwaps>);

            for (const ammSource in swapsByAmm) {
              const ammSwaps = swapsByAmm[ammSource];

              const processedSwaps = ammSwaps.map(swap => {
                const { token0, token1 } = swap.pair;
                const normalize = (amount: bigint, decimals: number) => Number(amount) / (10 ** decimals);

                let price = 0;
                let volume = 0;

                if (swap.amount0In > 0) {
                  const normalizedAmount0In = normalize(swap.amount0In, token0.decimals);
                  const normalizedAmount1Out = normalize(swap.amount1Out, token1.decimals);
                  if (normalizedAmount0In > 0) {
                    price = normalizedAmount1Out / normalizedAmount0In;
                  }
                  volume = normalizedAmount1Out;
                } else if (swap.amount1In > 0) {
                  const normalizedAmount1In = normalize(swap.amount1In, token1.decimals);
                  const normalizedAmount0Out = normalize(swap.amount0Out, token0.decimals);
                  if (normalizedAmount0Out > 0) {
                    price = normalizedAmount1In / normalizedAmount0Out;
                  }
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

              logger.info(`[${network}] Preparing OHLC upsert for pair ${pair.id} from ${ammSource} at ${timestamp.toISOString()} (${timeframe})`);

              upsertPromises.push(supabaseDb.ohlcData.upsert({
                where: {
                  network_ammSource_pairId_timeframe_timestamp: {
                    network,
                    ammSource: ammSource,
                    pairId: pair.id,
                    timeframe: timeframe,
                    timestamp,
                  },
                },
                update: ohlc,
                create: {
                  network,
                  ammSource: ammSource,
                  pairId: pair.id,
                  timeframe: timeframe,
                  timestamp,
                  ...ohlc,
                },
              }));
            }
          }

          if (upsertPromises.length > 0) {
            logger.info(`[${network}] Executing batch upsert of ${upsertPromises.length} OHLC records for pair ${pair.id}.`);
            await supabaseDb.$transaction(upsertPromises);
          }
        } else {
          // Logic for higher timeframes from 1m OHLC data
          // This block will now be skipped as only '1m' is in TIMEFRAMES
          logger.debug(`[${network}] Skipping aggregation for ${timeframe} as it's not '1m'.`);
        }
      } catch (error) {
        logger.error(`[${network}] Failed to process pair ${pair.id} for timeframe ${timeframe}:`, error);
      }
    }
  }
}
