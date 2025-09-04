import { sqliteDb } from '@/lib/prismadb';
import { createLogger } from '@/app/indexer/utils';
import { Prisma } from '@/prisma/dist/generated/sqlite';

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
          if (!pair.dexlynAmmTokenXAddress) return null;

          const tokenX = pair.token0.address === pair.dexlynAmmTokenXAddress ? pair.token0 : pair.token1;
          const tokenY = pair.token0.address === pair.dexlynAmmTokenXAddress ? pair.token1 : pair.token0;
          
          let price: number;
          let volume: number;
          let inputTokenSymbol: string;
          let inputVolume: number;
          let minTradeVolume: Prisma.Decimal | null;

          if (s.xIn > 0) { // User gives Token X
              price = normalize(s.yOut, tokenY.decimals) / normalize(s.xIn, tokenX.decimals);
              volume = normalize(s.xIn, tokenX.decimals);
              inputTokenSymbol = tokenX.symbol;
              inputVolume = volume;
              minTradeVolume = tokenX.minTradeVolume;
          } else { // User gives Token Y
              price = normalize(s.yIn, tokenY.decimals) / normalize(s.xOut, tokenX.decimals);
              volume = normalize(s.yIn, tokenY.decimals);
              inputTokenSymbol = tokenY.symbol;
              inputVolume = volume;
              minTradeVolume = tokenY.minTradeVolume;
          }

          return { ammSource: 'DexlynSwap', blockTimestamp: s.blockTimestamp, price, volume, inputTokenSymbol, inputVolume, minTradeVolume };
      }),
      ...spikeySwaps.map(s => {
        if (!pair.spikeyAmmToken0Address) return null;

            const token0Amm = pair.token0.address === pair.spikeyAmmToken0Address ? pair.token0 : pair.token1;
            const token1Amm = pair.token0.address === pair.spikeyAmmToken0Address ? pair.token1 : pair.token0;

            let price: number;
            let volume: number;
            let inputTokenSymbol: string;
            let inputVolume: number;
            let minTradeVolume: Prisma.Decimal | null;

            if (s.amount0In > 0) { // User gives token0
                price = normalize(s.amount0In, token0Amm.decimals) / normalize(s.amount1Out, token1Amm.decimals);
                volume = normalize(s.amount0In, token0Amm.decimals);
                inputTokenSymbol = token0Amm.symbol;
                inputVolume = volume;
                minTradeVolume = token0Amm.minTradeVolume;
            } else { // User gives token1
                price = normalize(s.amount0Out, token0Amm.decimals) / normalize(s.amount1In, token1Amm.decimals);
                volume = normalize(s.amount1In, token1Amm.decimals);
                inputTokenSymbol = token1Amm.symbol;
                inputVolume = volume;
                minTradeVolume = token1Amm.minTradeVolume;
            }

            return { ammSource: 'SpikeySwap', blockTimestamp: s.blockTimestamp, price, volume, inputTokenSymbol, inputVolume, minTradeVolume };

        }),
      ].filter((s): s is { ammSource: string; blockTimestamp: Date; price: number; volume: number, inputTokenSymbol: string, inputVolume: number, minTradeVolume: Prisma.Decimal | null } => {
          if (s === null || s.price <= 0 || !isFinite(s.price)) {
            return false;
          }
          
          if (s.minTradeVolume !== null && s.minTradeVolume !== undefined) {
            if (s.inputVolume < s.minTradeVolume.toNumber()) {
                logger.debug(`[${network}] Filtering out trade with volume ${s.inputVolume} ${s.inputTokenSymbol} which is below minimum of ${s.minTradeVolume}`);
                return false;
            }
          }

          return true;
        });


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
              network_ammSource_token0Address_token1Address_timeframe_timestamp: {
                network,
                ammSource,
                token0Address: pair.token0.address,
                token1Address: pair.token1.address,
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
              token0Address: pair.token0.address,
              token1Address: pair.token1.address,
              ...ohlc,
            },
          }));
        }
      }


      if (upsertPromises.length > 0) {
        await sqliteDb.$transaction(upsertPromises);
      }
    } catch (error) {
      logger.error(`[${network}] Failed to process pair ${pair.id} for local 1m aggregation:`, error);
    }
  }
}