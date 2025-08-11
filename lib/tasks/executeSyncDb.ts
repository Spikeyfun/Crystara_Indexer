import { sqliteDb, supabaseDb } from '@/lib/prismadb';
import { createLogger } from '@/app/indexer/utils';
import { EventPoller } from '@/app/indexer/poller';

const logger = createLogger('sync-db-optimized');

export async function synchronizeDatabases(network: string, poller: EventPoller) {
  logger.info(`[${network}] Starting optimized database synchronization...`);

  if (!poller.newSqliteDataCreated) {
    logger.info(`[${network}] Skipping database synchronization: no new data created in SQLite.`);
    return;
  }

  // ===== OPTIMIZACIÓN 1: Sincronizar Tokens en un único lote transaccional =====
  const localTokens = await sqliteDb.token.findMany({ where: { network } });

  if (localTokens.length > 0) {
    const tokenUpsertPromises = localTokens.map(localToken => 
      supabaseDb.token.upsert({
        where: { network_address: { network: localToken.network, address: localToken.address } },
        update: {},
        create: {
          network: localToken.network,
          address: localToken.address,
          wrappedAddress: localToken.wrappedAddress,
          symbol: localToken.symbol,
          name: localToken.name,
          decimals: localToken.decimals,
        },
      })
    );
    
    // Ejecutar todas las promesas de upsert de tokens en una sola transacción
    await supabaseDb.$transaction(tokenUpsertPromises);
    logger.info(`[${network}] Processed ${localTokens.length} tokens for synchronization in a single batch.`);
  }

  // ===== OPTIMIZACIÓN 2: Pre-búsqueda de todos los IDs y upsert de Pares en lote =====
  const localPairs = await sqliteDb.pair.findMany({
    where: { network },
    include: { token0: true, token1: true },
  });

  if (localPairs.length > 0) {
    // 1. Recolectar todas las direcciones de tokens únicas que necesitamos buscar
    const allTokenAddresses = new Set<string>();
    localPairs.forEach(pair => {
      allTokenAddresses.add(pair.token0.address);
      allTokenAddresses.add(pair.token1.address);
    });

    // 2. Realizar UNA SOLA consulta a Supabase para obtener todos los tokens necesarios
    const supabaseTokens = await supabaseDb.token.findMany({
      where: {
        network: network,
        address: { in: Array.from(allTokenAddresses) },
      },
      select: { id: true, address: true },
    });

    // 3. Crear un mapa para una búsqueda súper rápida en memoria (Dirección -> ID)
    const supabaseTokenMap = new Map<string, number>();
    supabaseTokens.forEach(token => {
      supabaseTokenMap.set(token.address, token.id);
    });

    // 4. Construir las promesas de upsert para los pares
    const pairUpsertPromises = [];
    let pairsToSyncCount = 0;

    for (const localPair of localPairs) {
      // Obtener los IDs desde el mapa en memoria, NO desde la base de datos
      const supabaseToken0Id = supabaseTokenMap.get(localPair.token0.address);
      const supabaseToken1Id = supabaseTokenMap.get(localPair.token1.address);

      if (!supabaseToken0Id || !supabaseToken1Id) {
        logger.warn(`[${network}] Skipping local pair ${localPair.id} because one or both token IDs were not found in the pre-fetched map.`);
        continue;
      }

      pairUpsertPromises.push(
        supabaseDb.pair.upsert({
          where: {
            network_token0Id_token1Id: {
              network: localPair.network,
              token0Id: supabaseToken0Id,
              token1Id: supabaseToken1Id,
            },
          },
          update: { spikeyAmmPairAddress: localPair.spikeyAmmPairAddress },
          create: {
            network: localPair.network,
            token0Id: supabaseToken0Id,
            token1Id: supabaseToken1Id,
            spikeyAmmPairAddress: localPair.spikeyAmmPairAddress,
            spikeyAmmReserve0: localPair.spikeyAmmReserve0,
            spikeyAmmReserve1: localPair.spikeyAmmReserve1,
          },
        })
      );
      pairsToSyncCount++;
    }

    // 5. Ejecutar todas las promesas de upsert de pares en una sola transacción
    if (pairUpsertPromises.length > 0) {
      await supabaseDb.$transaction(pairUpsertPromises);
    }
    logger.info(`[${network}] Processed ${pairsToSyncCount} pairs for synchronization in a single batch.`);
  }

  logger.info(`[${network}] Optimized database synchronization finished.`);
  
  poller.resetNewSqliteDataCreated();
}