import { sqliteDb, supabaseDb } from '@/lib/prismadb';
import { createLogger } from '@/app/indexer/utils';
import { Prisma } from '@prisma/client/sqlite';

const logger = createLogger('ohlc-aggregator');

const TIMEFRAME = '1m'; // Por ahora, solo calculamos velas de 1 minuto.

export async function executeOhlcAggregation(network: string) {
  logger.info(`[${network}] Starting OHLC aggregation for timeframe: ${TIMEFRAME}`);

  // 1. Obtener todos los pares para la red actual.
  const pairs = await sqliteDb.pair.findMany({
    where: { network },
  });

  if (pairs.length === 0) {
    logger.info(`[${network}] No pairs found to process.`);
    return;
  }

  logger.info(`[${network}] Found ${pairs.length} pairs to process.`);

  // 2. Procesar cada par uno por uno.
  for (const pair of pairs) {
    try {
      // 3. Encontrar la última vela que calculamos para este par.
      const lastOhlc = await supabaseDb.ohlcData.findFirst({
        where: {
          network,
          pairId: pair.id,
          timeframe: TIMEFRAME,
        },
        orderBy: {
          timestamp: 'desc',
        },
      });

      const startTime = lastOhlc ? lastOhlc.timestamp : new Date(0); // Si no hay, empezar desde el inicio de los tiempos.
      logger.info(`[${network}] Processing pair ${pair.id}. Last OHLC timestamp: ${startTime.toISOString()}`);

      // 4. Obtener todos los swaps nuevos desde la última vela para ambos AMMs.
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

      // Unificar los swaps en una sola estructura para procesarlos de manera uniforme.
      const unifiedSwaps = [
        ...dexlynSwaps.map(s => ({
          ...s,
          ammSource: 'DexlynSwap',
          // Normalizar los campos de montos para que sean consistentes
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

      // Ordenar todos los swaps por fecha para asegurar el orden cronológico correcto.
      const newSwaps = unifiedSwaps.sort((a, b) => a.blockTimestamp.getTime() - b.blockTimestamp.getTime());

      if (newSwaps.length === 0) {
        logger.info(`[${network}] No new swaps for pair ${pair.id}.`);
        continue;
      }

      logger.info(`[${network}] Found ${newSwaps.length} new swaps for pair ${pair.id}.`);

      // 5. Agrupar swaps por "bucket" de 1 minuto.
      const swapsByMinute = newSwaps.reduce((acc, swap) => {
        const minuteTimestamp = new Date(swap.blockTimestamp);
        minuteTimestamp.setSeconds(0, 0); // Redondear al inicio del minuto.

        const key = minuteTimestamp.toISOString();
        if (!acc[key]) {
          acc[key] = [];
        }
        acc[key].push(swap);
        return acc;
      }, {} as Record<string, typeof newSwaps>);

      // 6. Calcular y guardar la vela para cada minuto.
      for (const timestampKey in swapsByMinute) {
        const minuteSwaps = swapsByMinute[timestampKey];
        const timestamp = new Date(timestampKey);

        // Calcular el precio y volumen real para cada swap.
        const processedSwaps = minuteSwaps.map(swap => {
          const { token0, token1 } = swap.pair;

          const normalize = (amount: bigint, decimals: number) => Number(amount) / (10 ** decimals);

          let price = 0;
          let volume = 0; // Volumen medido en token1

          if (swap.amount0In > 0) { // Venta de token0 por token1
            const normalizedAmount0In = normalize(swap.amount0In, token0.decimals);
            const normalizedAmount1Out = normalize(swap.amount1Out, token1.decimals);
            if (normalizedAmount0In > 0) {
              price = normalizedAmount1Out / normalizedAmount0In;
            }
            volume = normalizedAmount1Out;
          } else if (swap.amount1In > 0) { // Venta de token1 por token0
            const normalizedAmount1In = normalize(swap.amount1In, token1.decimals);
            const normalizedAmount0Out = normalize(swap.amount0Out, token0.decimals);
            if (normalizedAmount0Out > 0) {
              price = normalizedAmount1In / normalizedAmount0Out;
            }
            volume = normalizedAmount1In;
          }

          return { price, volume, ammSource: swap.ammSource };
        }).filter(s => s.price > 0 && isFinite(s.price)); // Filtrar swaps sin precio válido

        if (processedSwaps.length === 0) continue;

        const prices = processedSwaps.map(s => s.price);
        const totalVolume = processedSwaps.reduce((sum, s) => sum + s.volume, 0);
        const ammSource = processedSwaps[0].ammSource; // Todos los swaps en este bucket son del mismo par y AMM

        const ohlc = {
          open: prices[0],
          high: Math.max(...prices),
          low: Math.min(...prices),
          close: prices[prices.length - 1],
          volume: new Prisma.Decimal(totalVolume),
          tradeCount: processedSwaps.length,
        };

        logger.info(`[${network}] Upserting OHLC for pair ${pair.id} from ${ammSource} at ${timestamp.toISOString()}`);

        // 7. Guardar en Supabase (y opcionalmente en SQLite)
        await supabaseDb.ohlcData.upsert({
          where: {
            network_ammSource_pairId_timeframe_timestamp: {
              network,
              ammSource: ammSource, // Usar la variable dinámica
              pairId: pair.id,
              timeframe: TIMEFRAME,
              timestamp,
            },
          },
          update: ohlc,
          create: {
            network,
            ammSource: ammSource, // Usar la variable dinámica
            pairId: pair.id,
            timeframe: TIMEFRAME,
            timestamp,
            ...ohlc,
          },
        });
      }
    } catch (error) {
      logger.error(`[${network}] Failed to process pair ${pair.id}:`, error);
    }
  }
}
