import { sqliteDb, supabaseDb } from '@/lib/prismadb';
import { createLogger } from '@/app/indexer/utils';

const logger = createLogger('sync-db');

export async function synchronizeDatabases(network: string) {
  logger.info(`[${network}] Starting database synchronization...`);

  // 1. Sincronizar Tokens
  const localTokens = await sqliteDb.token.findMany({ where: { network } });
  const remoteTokens = await supabaseDb.token.findMany({ where: { network } });
  const remoteTokenIds = new Set(remoteTokens.map(t => t.id));

  const newTokens = localTokens.filter(t => !remoteTokenIds.has(t.id));

  if (newTokens.length > 0) {
    logger.info(`[${network}] Found ${newTokens.length} new tokens to sync.`);
    // Usamos createMany para una inserción más eficiente
    await supabaseDb.token.createMany({
      data: newTokens,
      skipDuplicates: true, // Por si acaso hay una condición de carrera
    });
  }

  // 2. Sincronizar Pares
  const localPairs = await sqliteDb.pair.findMany({ where: { network } });
  const remotePairs = await supabaseDb.pair.findMany({ where: { network } });
  const remotePairIds = new Set(remotePairs.map(p => p.id));

  const newPairs = localPairs.filter(p => !remotePairIds.has(p.id));

  if (newPairs.length > 0) {
    logger.info(`[${network}] Found ${newPairs.length} new pairs to sync.`);
    await supabaseDb.pair.createMany({
      data: newPairs,
      skipDuplicates: true,
    });
  }

  logger.info(`[${network}] Database synchronization finished. Found ${newTokens.length} new tokens and ${newPairs.length} new pairs.`);
}
