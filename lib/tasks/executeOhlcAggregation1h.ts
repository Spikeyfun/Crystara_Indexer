import { sqliteDb, supabaseDb } from '@/lib/prismadb';
import { createLogger } from '@/app/indexer/utils';
import { Prisma as SupabasePrisma } from '@/prisma/dist/generated/supabase';
import { OhlcData as SqliteOhlcData } from '@/prisma/dist/generated/sqlite/client';

const logger = createLogger('ohlc-aggregator-1h');

// Helper function para redondear el timestamp a la hora más cercana
function roundTimestampToInterval(timestamp: Date): Date {
  const date = new Date(timestamp);
  date.setMinutes(0, 0, 0); // Redondea hacia abajo al inicio de la hora
  return date;
}

export async function executeOhlcAggregation1h(network: string) {
  const inputTimeframe = '1m';
  const outputTimeframe = '1h';
  logger.info(`[${network}] Starting 1h OHLC aggregation (SQLite -> Supabase)`);

  // 1. Obtener los pares únicos que tienen datos de 1m en la base de datos local
  const distinctPairs = await sqliteDb.ohlcData.findMany({
    where: { network, timeframe: inputTimeframe },
    distinct: ['token0Address', 'token1Address'],
    select: { token0Address: true, token1Address: true },
  });

  if (distinctPairs.length === 0) {
    logger.info(`[${network}] No pairs with 1m data found in SQLite to process for 1h aggregation.`);
    return;
  }
  logger.info(`[${network}] Found ${distinctPairs.length} distinct pairs in SQLite to process for 1h aggregation.`);

  for (const ohlcPair of distinctPairs) {
    try {
      const { token0Address, token1Address } = ohlcPair;

      // 2. Revisar el último dato de 1h en el DESTINO (Supabase) para saber desde dónde empezar
      const lastOhlc1h = await supabaseDb.ohlcData.findFirst({
        where: { network, token0Address, token1Address, timeframe: outputTimeframe },
        orderBy: { timestamp: 'desc' },
      });

      let startTime: Date;
      if (lastOhlc1h) {
        // Empezar desde la siguiente hora
        startTime = new Date(lastOhlc1h.timestamp);
        startTime.setUTCHours(startTime.getUTCHours() + 1);
      } else {
        // Si no hay datos, buscar el primer dato de 1m en el ORIGEN (SQLite)
        const earliest1mOhlc = await sqliteDb.ohlcData.findFirst({
          where: { network, token0Address, token1Address, timeframe: inputTimeframe },
          orderBy: { timestamp: 'asc' },
          select: { timestamp: true },
        });

        if (!earliest1mOhlc) continue; // No hay datos de origen para este par
        startTime = roundTimestampToInterval(earliest1mOhlc.timestamp);
      }

      if (startTime.getTime() > new Date().getTime()) continue; // No procesar el futuro

      // 3. Obtener todos los datos de 1m necesarios desde el ORIGEN (SQLite)
      const ohlc1mData = await sqliteDb.ohlcData.findMany({
        where: { network, token0Address, token1Address, timeframe: inputTimeframe, timestamp: { gte: startTime } },
        orderBy: { timestamp: 'asc' },
      });

      if (ohlc1mData.length === 0) continue;

      // 4. Agrupar los datos de 1m en bloques de 1h
      const ohlcByHour = ohlc1mData.reduce((acc, ohlc) => {
        const key = roundTimestampToInterval(ohlc.timestamp).toISOString();
        if (!acc[key]) acc[key] = [];
        acc[key].push(ohlc);
        return acc;
      }, {} as Record<string, SqliteOhlcData[]>);

      const upsertPromises = [];

      for (const timestampKey in ohlcByHour) {
        const intervalData = ohlcByHour[timestampKey];
        const timestamp = new Date(timestampKey);

        // Agrupar por fuente de AMM para crear un gráfico por cada uno
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

          // 5. Preparar el 'upsert' para el DESTINO (Supabase)
          upsertPromises.push(supabaseDb.ohlcData.upsert({
            where: {
              network_ammSource_token0Address_token1Address_timeframe_timestamp: { 
                  network, ammSource, token0Address, token1Address, timeframe: outputTimeframe, timestamp 
                } 
            },
            update: ohlc,
            // Usamos la forma explícita en 'create' para máxima compatibilidad y claridad
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
        logger.info(`[${network}] Upserted ${upsertPromises.length} 1h OHLC records to Supabase for pair ${token0Address}/${token1Address}.`);
      }
    } catch (error) {
      logger.error(`[${network}] Failed to process pair ${ohlcPair.token0Address}/${ohlcPair.token1Address} for 1h aggregation:`, error);
    }
  }
}