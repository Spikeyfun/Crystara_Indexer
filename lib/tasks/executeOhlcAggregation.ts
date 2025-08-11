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
          if (!pair.dexlynAmmTokenXAddress) return null;

      
          // Determina cuál de los tokens del par (ordenados alfabéticamente) es X y cuál es Y
          const tokenX = pair.token0.address === pair.dexlynAmmTokenXAddress ? pair.token0 : pair.token1;
          const tokenY = pair.token0.address === pair.dexlynAmmTokenXAddress ? pair.token1 : pair.token0;
          
          let price: number;
          let volumeInTokenX: number; // El volumen se mide en el token de entrada

          if (s.xIn > 0) { // El usuario entrega Token X para recibir Token Y
              // El precio de Token X en términos de Token Y = cantidad de Y / cantidad de X
              price = normalize(s.yOut, tokenY.decimals) / normalize(s.xIn, tokenX.decimals);
              volumeInTokenX = normalize(s.xIn, tokenX.decimals);
          } else { // El usuario entrega Token Y para recibir Token X
              // El precio de Token X en términos de Token Y = cantidad de Y / cantidad de X
              price = normalize(s.yIn, tokenY.decimals) / normalize(s.xOut, tokenX.decimals);
              volumeInTokenX = normalize(s.xOut, tokenX.decimals);
          }

          return { ammSource: 'DexlynSwap', blockTimestamp: s.blockTimestamp, price, volume: volumeInTokenX };
      }),
      ...spikeySwaps.map(s => {
        // Verifica que tengamos la información del orden de tokens para este AMM
        if (!pair.spikeyAmmToken0Address) return null;

            // Determina cuál de los tokens del par (ordenados alfabéticamente) es 0 y cuál es 1
            const token0Amm = pair.token0.address === pair.spikeyAmmToken0Address ? pair.token0 : pair.token1;
            const token1Amm = pair.token0.address === pair.spikeyAmmToken0Address ? pair.token1 : pair.token0;

            let price: number;
            let volumeInToken0: number; // El volumen se mide en el token de entrada

            if (s.amount0In > 0) { // User gives token0 (amount0In), gets token1 (amount1Out)
                price = normalize(s.amount1Out, token1Amm.decimals) / normalize(s.amount0In, token0Amm.decimals);
                volumeInToken0 = normalize(s.amount0In, token0Amm.decimals);
            } else { // User gives token1 (amount1In), gets token0 (amount0Out)
                price = normalize(s.amount1In, token1Amm.decimals) / normalize(s.amount0Out, token0Amm.decimals);
                volumeInToken0 = normalize(s.amount0Out, token0Amm.decimals);
            }

            return { ammSource: 'SpikeySwap', blockTimestamp: s.blockTimestamp, price, volume: volumeInToken0 };

        }),
      ].filter((s): s is { ammSource: string; blockTimestamp: Date; price: number; volume: number; } => s !== null && s.price > 0 && isFinite(s.price)); // Filtro mejorado


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
