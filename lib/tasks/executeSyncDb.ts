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

  // 1. Sincronizar Tokens
  const localTokens = await sqliteDb.token.findMany({ where: { network } });
  const supabaseTokens = await supabaseDb.token.findMany({ where: { network } });

  const supabaseTokenMap = new Map<string, number>(); // Map: tokenAddress -> supabaseId
  supabaseTokens.forEach(token => supabaseTokenMap.set(token.address, token.id));

  const newTokensToCreate = [];
  for (const localToken of localTokens) {
    if (!supabaseTokenMap.has(localToken.address)) {
      newTokensToCreate.push({
        network: localToken.network,
        address: localToken.address,
        wrappedAddress: localToken.wrappedAddress,
        symbol: localToken.symbol,
        name: localToken.name,
        decimals: localToken.decimals,
        // createdAt will default
      });
    }
  }

  if (newTokensToCreate.length > 0) {
    logger.info(`[${network}] Found ${newTokensToCreate.length} new tokens to sync.`);
    await supabaseDb.token.createMany({
      data: newTokensToCreate,
      skipDuplicates: true, // In case of race conditions, though we filter above
    });
    // Re-fetch all tokens to ensure map is up-to-date with new Supabase IDs
    const updatedSupabaseTokens = await supabaseDb.token.findMany({ where: { network } });
    updatedSupabaseTokens.forEach(token => supabaseTokenMap.set(token.address, token.id));
  }

  // 2. Sincronizar Pares
  const localPairs = await sqliteDb.pair.findMany({ where: { network } });
  const supabasePairs = await supabaseDb.pair.findMany({ where: { network } });

  const supabasePairSet = new Set<string>(); // Use a unique identifier for existing pairs
  supabasePairs.forEach(pair => {
    const token0Address = supabaseTokens.find(t => t.id === pair.token0Id)?.address;
    const token1Address = supabaseTokens.find(t => t.id === pair.token1Id)?.address;
    if (token0Address && token1Address) {
      supabasePairSet.add(`${pair.network}-${token0Address}-${token1Address}`);
    }
  });

  const newPairsToCreate = [];
  for (const localPair of localPairs) {
    const localToken0 = localTokens.find(t => t.id === localPair.token0Id);
    const localToken1 = localTokens.find(t => t.id === localPair.token1Id);

    if (!localToken0 || !localToken1) {
      logger.warn(`[${network}] Skipping local pair ${localPair.id} due to missing local tokens.`);
      continue;
    }

    const supabaseToken0Id = supabaseTokenMap.get(localToken0.address);
    const supabaseToken1Id = supabaseTokenMap.get(localToken1.address);

    if (supabaseToken0Id === undefined || supabaseToken1Id === undefined) {
      logger.warn(`[${network}] Skipping local pair ${localPair.id} due to missing Supabase token IDs.`);
      continue;
    }

    const uniquePairIdentifier = `${localPair.network}-${localToken0.address}-${localToken1.address}`;
    if (!supabasePairSet.has(uniquePairIdentifier)) {
      newPairsToCreate.push({
        network: localPair.network,
        token0Id: supabaseToken0Id,
        token1Id: supabaseToken1Id,
        spikeyAmmPairAddress: localPair.spikeyAmmPairAddress,
        spikeyAmmReserve0: localPair.spikeyAmmReserve0,
        spikeyAmmReserve1: localPair.spikeyAmmReserve1,
        // lastStatsUpdate is not in Supabase schema, so we don't include it
        // createdAt will default
      });
    }
  }

  if (newPairsToCreate.length > 0) {
    logger.info(`[${network}] Found ${newPairsToCreate.length} new pairs to sync.`);
    try {
      await supabaseDb.pair.createMany({
        data: newPairsToCreate,
        skipDuplicates: true, // In case of race conditions
      });
    } catch (error: any) {
      logger.error(`[${network}] Error creating new pairs in Supabase: ${error.message}`);
      // Log the full error object if it's a PrismaClientKnownRequestError for more details
      if (error.code && error.code.startsWith('P')) {
        logger.error(`[${network}] Prisma Error Code: ${error.code}`);
        logger.error(`[${network}] Prisma Error Meta: ${JSON.stringify(error.meta)}`);
      }
      throw error; // Re-throw to ensure the task fails and the main error is still reported
    }
  }

  logger.info(`[${network}] Database synchronization finished. Found ${newTokensToCreate.length} new tokens and ${newPairsToCreate.length} new pairs.`);
}
