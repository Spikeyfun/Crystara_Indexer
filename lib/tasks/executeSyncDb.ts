import { sqliteDb } from '@/lib/prismadb';
import { createLogger } from '@/app/indexer/utils';
import { EventPoller } from '@/app/indexer/poller';

import { getDb, tokens_v2, ammpair_v2 } from '../drizzle';

const logger = createLogger('sync-db-optimized');

export async function synchronizeDatabases(network: string, poller: EventPoller) {
  logger.info(`[${network}] Starting optimized database synchronization (V2)...`);

  if (!poller.newSqliteDataCreated) {
    logger.info(`[${network}] Skipping database synchronization: no new data created in SQLite.`);
    return;
  }

  const db = await getDb();

  // ===== OPTIMIZACIÓN 1: Sincronizar Tokens en un único lote a V2 =====
  const localTokens = await sqliteDb.token.findMany({ where: { network } });

  if (localTokens.length > 0) {
    const tokenValues = localTokens.map(localToken => ({
      id: localToken.address,
      network: localToken.network,
      name: localToken.name,
      symbol: localToken.symbol,
      decimals: localToken.decimals,
    }));
    
    try {
        await db.insert(tokens_v2)
            .values(tokenValues)
            .onConflictDoNothing({ target: tokens_v2.id });
        logger.info(`[${network}] Processed ${localTokens.length} tokens for synchronization to V2.`);
    } catch (e: any) {
        logger.error(`[${network}] Failed to insert tokens into V2: ${e.message}`);
    }
  }

  // ===== OPTIMIZACIÓN 2: Inserción de Pares en V2 =====
  const localPairs = await sqliteDb.pair.findMany({
    where: { network },
    include: { token0: true, token1: true },
  });

  if (localPairs.length > 0) {
    const pairValues = localPairs
        .filter(localPair => localPair.spikeyAmmPairAddress) // In V2, pair address is required
        .map(localPair => ({
          id: localPair.spikeyAmmPairAddress!, 
          pair: localPair.spikeyAmmPairAddress!,
          network: localPair.network,
          creator: "amm_indexer_sync",
          token0Address: localPair.token0.address,
          token1Address: localPair.token1.address,
          lpFeePercent: "0.003", 
        }));

    if (pairValues.length > 0) {
        try {
            await db.insert(ammpair_v2)
                .values(pairValues)
                .onConflictDoNothing({ target: ammpair_v2.id });
            logger.info(`[${network}] Processed ${pairValues.length} pairs for synchronization to V2.`);
        } catch (e: any) {
            logger.error(`[${network}] Failed to insert pairs into V2: ${e.message}`);
        }
    }
  }

  logger.info(`[${network}] Optimized database synchronization finished.`);
  
  poller.resetNewSqliteDataCreated();
}