import { sqliteDb } from '@/lib/prismadb';
import { createLogger } from '@/app/indexer/utils';
import { Prisma } from '@/prisma/generated/sqlite';

const logger = createLogger('ohlc-aggregator-1m-local');

// Helper function to round a timestamp down to the nearest minute
function roundTimestampToInterval(timestamp: Date): Date {
  const date = new Date(timestamp);
  date.setSeconds(0, 0);
  return date;
}

// Helper function to safely normalize bigint amounts to numbers
const normalize = (amount: bigint, decimals: number) => {
  if (decimals < 0) return 0;
  try {
      return Number(amount) / (10 ** decimals);
  } catch (e) {
      return 0;
  }
};

export async function executeOhlcAggregation1mLocal(network: string) {
  const timeframe = '1m';
  logger.info(`[${network}] Starting LOCAL OHLC aggregation for timeframe: ${timeframe}`);

  // --- PASO 1: Cargar las Reglas de Negocio desde la DB ---
  const anchorTokens = await sqliteDb.anchorToken.findMany({
    where: { network },
  });
  const anchorPriorityMap = new Map<string, number>();
  for (const anchor of anchorTokens) {
    anchorPriorityMap.set(anchor.tokenAddress.toLowerCase(), anchor.priority);
  }
  logger.info(`[${network}] Loaded ${anchorPriorityMap.size} anchor token rules from the DB.`);
  // --- FIN PASO 1 ---

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
      // --- PASO 2: Ordenamiento Canónico de Tokens ---
      // Aplicamos las reglas de negocio para determinar consistentemente qué token es 'token0' y cuál es 'token1'.
      let token0, token1;
      const tA = pair.token0;
      const tB = pair.token1;

      const priorityA = anchorPriorityMap.get(tA.address.toLowerCase()) ?? Infinity;
      const priorityB = anchorPriorityMap.get(tB.address.toLowerCase()) ?? Infinity;

      if (priorityA < priorityB) {
        token0 = tA; token1 = tB;
      } else if (priorityB < priorityA) {
        token0 = tB; token1 = tA;
      } else {
        if (tA.address.localeCompare(tB.address) < 0) {
          token0 = tA; token1 = tB;
        } else {
          token0 = tB; token1 = tA;
        }
      }
      // A partir de aquí, 'token0' y 'token1' son nuestras referencias canónicas y estables.
      // --- FIN PASO 2 ---

      const lastOhlc = await sqliteDb.ohlcData.findFirst({
        where: {
          network,
          token0Address: token0.address, // Usar dirección canónica
          token1Address: token1.address, // Usar dirección canónica
          timeframe: timeframe,
        },
        orderBy: { timestamp: 'desc' },
      });

      // La lógica para determinar 'startTime' y obtener los swaps no cambia...
      let startTime: Date;
      if (lastOhlc) {
        startTime = new Date(lastOhlc.timestamp);
        startTime.setMinutes(startTime.getMinutes() + 1);
      } else {
        const earliestSwap = await sqliteDb.dexlynSwap.findFirst({ where: { pairId: pair.id }, orderBy: { blockTimestamp: 'asc' }});
        const earliestSpikeySwap = await sqliteDb.spikeyAmmSwap.findFirst({ where: { pairId: pair.id }, orderBy: { blockTimestamp: 'asc' }});
        const earliestTimestamp = earliestSwap && earliestSpikeySwap
          ? new Date(Math.min(earliestSwap.blockTimestamp.getTime(), earliestSpikeySwap.blockTimestamp.getTime()))
          : earliestSwap ? earliestSwap.blockTimestamp : earliestSpikeySwap ? earliestSpikeySwap.blockTimestamp : null;
        startTime = earliestTimestamp ? roundTimestampToInterval(earliestTimestamp) : new Date(0);
      }

      if (startTime.getTime() > new Date().getTime()) continue;

      const [dexlynSwaps, spikeySwaps] = await Promise.all([
        sqliteDb.dexlynSwap.findMany({ where: { pairId: pair.id, blockTimestamp: { gt: startTime } } }),
        sqliteDb.spikeyAmmSwap.findMany({ where: { pairId: pair.id, blockTimestamp: { gt: startTime } } }),
      ]);
      // ... fin de la lógica sin cambios.

      // --- PASO 3: Unificar Swaps y Estandarizar el Volumen ---
      const unifiedSwaps = [
        ...dexlynSwaps.map(s => {
          if (!pair.dexlynAmmTokenXAddress) return null;
          const tokenX = pair.token0.address === pair.dexlynAmmTokenXAddress ? pair.token0 : pair.token1;
          const tokenY = pair.token0.address === pair.dexlynAmmTokenXAddress ? pair.token1 : pair.token0;
          
          let priceInT1PerT0: number;
          let volumeInToken1: number;

          if (s.xIn > 0) { // User gives Token X, receives Token Y
              const amountXIn = normalize(s.xIn, tokenX.decimals);
              const amountYOut = normalize(s.yOut, tokenY.decimals);
              if (amountXIn === 0) return null;
              const priceInYPerX = amountYOut / amountXIn;
              
              // Estandarizamos precio y volumen
              if (tokenX.address === token0.address) { // X es token0
                priceInT1PerT0 = priceInYPerX;
                volumeInToken1 = amountXIn * priceInT1PerT0; // Convertir volumen a token1
              } else { // X es token1
                priceInT1PerT0 = 1 / priceInYPerX;
                volumeInToken1 = amountXIn; // Ya está en token1
              }
          } else { // User gives Token Y, receives Token X
              const amountYIn = normalize(s.yIn, tokenY.decimals);
              const amountXOut = normalize(s.xOut, tokenX.decimals);
              if (amountXOut === 0) return null;
              const priceInYPerX = amountYIn / amountXOut;
              
              if (tokenY.address === token0.address) { // Y es token0
                priceInT1PerT0 = priceInYPerX;
                volumeInToken1 = amountYIn * priceInT1PerT0; // Convertir volumen a token1
              } else { // Y es token1
                priceInT1PerT0 = 1 / priceInYPerX;
                volumeInToken1 = amountYIn; // Ya está en token1
              }
          }
          return { ammSource: 'DexlynSwap', blockTimestamp: s.blockTimestamp, price: priceInT1PerT0, volume: volumeInToken1 };
        }),
        ...spikeySwaps.map(s => {
            if (!pair.spikeyAmmToken0Address) return null;
            const token0Amm = pair.token0.address === pair.spikeyAmmToken0Address ? pair.token0 : pair.token1;
            const token1Amm = pair.token0.address === pair.spikeyAmmToken0Address ? pair.token1 : pair.token0;

            let priceInT1PerT0: number;
            let volumeInToken1: number;

            if (s.amount0In > 0) { // User gives token0Amm, receives token1Amm
                const amount0In = normalize(s.amount0In, token0Amm.decimals);
                const amount1Out = normalize(s.amount1Out, token1Amm.decimals);
                if (amount0In === 0) return null;
                priceInT1PerT0 = amount1Out / amount0In;
                volumeInToken1 = amount0In * priceInT1PerT0; // Convertir volumen a token1
            } else { // User gives token1Amm, receives token0Amm
                const amount1In = normalize(s.amount1In, token1Amm.decimals);
                const amount0Out = normalize(s.amount0Out, token0Amm.decimals);
                if (amount0Out === 0) return null;
                priceInT1PerT0 = amount1In / amount0Out;
                volumeInToken1 = amount1In; // Ya está en token1
            }
            
            // Aseguramos que el precio siempre esté en T1/T0
            const finalPrice = token0Amm.address === token0.address ? priceInT1PerT0 : 1 / priceInT1PerT0;

            return { ammSource: 'SpikeySwap', blockTimestamp: s.blockTimestamp, price: finalPrice, volume: volumeInToken1 };
        }),
      ].filter((s): s is { ammSource: string; blockTimestamp: Date; price: number; volume: number } => {
          return s !== null && s.price > 0 && isFinite(s.price);
      });
      // --- FIN PASO 3 ---

      if (unifiedSwaps.length === 0) continue;
      
      const newSwaps = unifiedSwaps.sort((a, b) => a.blockTimestamp.getTime() - b.blockTimestamp.getTime());

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
            volume: new Prisma.Decimal(totalVolume), // Este volumen está estandarizado
            tradeCount: ammSwaps.length,
          };

          upsertPromises.push(sqliteDb.ohlcData.upsert({
            where: {
              network_ammSource_token0Address_token1Address_timeframe_timestamp: {
                network,
                ammSource,
                token0Address: token0.address, // Guardar con la dirección canónica
                token1Address: token1.address, // Guardar con la dirección canónica
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
              token0Address: token0.address, // Guardar con la dirección canónica
              token1Address: token1.address, // Guardar con la dirección canónica
              ...ohlc,
            },
          }));
        }
      }

      if (upsertPromises.length > 0) {
        await sqliteDb.$transaction(upsertPromises);
      }
    } catch (error) {
      logger.error(`[${network}] Failed to process pair ${pair.id} for local 1m aggregation:`, {
        error,
        pairDetails: { token0: pair.token0.symbol, token1: pair.token1.symbol }
      });
    }
  }
}