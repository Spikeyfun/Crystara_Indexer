import { sqliteDb, supabaseDb } from '@/lib/prismadb';
import { createLogger } from '@/app/indexer/utils';
import { EventPoller } from '@/app/indexer/poller';

const logger = createLogger('sync-db');

export async function synchronizeDatabases(network: string, poller: EventPoller) {
  logger.info(`[${network}] Starting database synchronization...`);

  if (!poller.newSqliteDataCreated) {
    logger.info(`[${network}] Skipping database synchronization: no new data created in SQLite.`);
    return;
  }

  // 1. Sincronizar Tokens usando upsert
  const localTokens = await sqliteDb.token.findMany({ where: { network } });
  let syncedTokensCount = 0;

  for (const localToken of localTokens) {
    const result = await supabaseDb.token.upsert({
      where: {
        network_address: {
          network: localToken.network,
          address: localToken.address,
        },
      },
      update: {}, // No necesitamos actualizar nada si ya existe
      create: {
        network: localToken.network,
        address: localToken.address,
        wrappedAddress: localToken.wrappedAddress,
        symbol: localToken.symbol,
        name: localToken.name,
        decimals: localToken.decimals,
      },
    });
    // Si se crea un nuevo token, el resultado no será nulo.
    // Podríamos verificar si se creó o no, pero por ahora solo contamos el intento.
  }
  logger.info(`[${network}] Processed ${localTokens.length} tokens for synchronization.`);


  // 2. Sincronizar Pares usando upsert
  const localPairs = await sqliteDb.pair.findMany({
    where: { network },
    include: {
      token0: true,
      token1: true,
    },
  });
  let syncedPairsCount = 0;

  for (const localPair of localPairs) {
    // Encontrar los IDs correspondientes en Supabase para los tokens del par
    const supabaseToken0 = await supabaseDb.token.findUnique({
      where: {
        network_address: {
          network: localPair.token0.network,
          address: localPair.token0.address,
        },
      },
      select: { id: true },
    });

    const supabaseToken1 = await supabaseDb.token.findUnique({
      where: {
        network_address: {
          network: localPair.token1.network,
          address: localPair.token1.address,
        },
      },
      select: { id: true },
    });

    if (!supabaseToken0 || !supabaseToken1) {
      logger.warn(`[${network}] Skipping local pair ${localPair.id} because one or both tokens were not found in Supabase.`);
      continue;
    }

    // Usar los IDs de Supabase para el upsert del par
    await supabaseDb.pair.upsert({
      where: {
        network_token0Id_token1Id: {
          network: localPair.network,
          token0Id: supabaseToken0.id,
          token1Id: supabaseToken1.id,
        },
      },
      update: {
        // Opcional: podrías actualizar reservas aquí si fuera necesario
        spikeyAmmPairAddress: localPair.spikeyAmmPairAddress,
      },
      create: {
        network: localPair.network,
        token0Id: supabaseToken0.id,
        token1Id: supabaseToken1.id,
        spikeyAmmPairAddress: localPair.spikeyAmmPairAddress,
        spikeyAmmReserve0: localPair.spikeyAmmReserve0,
        spikeyAmmReserve1: localPair.spikeyAmmReserve1,
      },
    });
    syncedPairsCount++;
  }

  logger.info(`[${network}] Processed ${syncedPairsCount} pairs for synchronization.`);
  logger.info(`[${network}] Database synchronization finished.`);
  
  // Reset the flag after a successful sync
  poller.resetNewSqliteDataCreated();
}