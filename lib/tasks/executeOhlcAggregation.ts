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

      // 4. Obtener todos los swaps nuevos desde la última vela.
      const newSwaps = await sqliteDb.dexlynSwap.findMany({ // NOTA: Por ahora solo DexlynSwap
        where: {
          pairId: pair.id,
          blockTimestamp: {
            gt: startTime,
          },
        },
        orderBy: {
          blockTimestamp: 'asc',
        },
      });

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

        // Aquí iría la lógica para calcular el precio de cada swap.
        // Por ahora, usaremos un placeholder.
        const prices = minuteSwaps.map(() => Math.random() * 100); // ¡¡¡PLACEHOLDER!!!
        const volume = minuteSwaps.reduce((sum, s) => sum + (Number(s.xIn) + Number(s.yIn)), 0); // Placeholder de volumen

        const ohlc = {
          open: prices[0],
          high: Math.max(...prices),
          low: Math.min(...prices),
          close: prices[prices.length - 1],
          volume: new Prisma.Decimal(volume),
          tradeCount: minuteSwaps.length,
        };

        logger.info(`[${network}] Upserting OHLC for pair ${pair.id} at ${timestamp.toISOString()}`);

        // 7. Guardar en Supabase (y opcionalmente en SQLite)
        await supabaseDb.ohlcData.upsert({
          where: {
            network_ammSource_pairId_timeframe_timestamp: {
              network,
              ammSource: 'DexlynSwap', // NOTA: Hardcodeado por ahora
              pairId: pair.id,
              timeframe: TIMEFRAME,
              timestamp,
            },
          },
          update: ohlc,
          create: {
            network,
            ammSource: 'DexlynSwap',
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
