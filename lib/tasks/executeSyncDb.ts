import { sqliteDb, supabaseDb } from '@/lib/prismadb';
import { createLogger } from '@/app/indexer/utils';
import { EventPoller } from '@/app/indexer/poller';

const logger = createLogger('sync-db');

/**
 * Syncs the local SQLite "hot" buffer (Token / Pair) into the V2 Supabase
 * tables (tokens_v2 / ammpair_v2). Uses Prisma — the single ORM for the repo —
 * instead of a second raw pg/drizzle client.
 */
export async function synchronizeDatabases(network: string, poller: EventPoller) {
  logger.info(`[${network}] Starting database synchronization (V2)...`);

  if (!poller.newSqliteDataCreated) {
    logger.info(`[${network}] Skipping database synchronization: no new data created in SQLite.`);
    return;
  }

  // ===== Tokens -> tokens_v2 =====
  const localTokens = await sqliteDb.token.findMany({ where: { network } });
  if (localTokens.length > 0) {
    try {
      const result = await supabaseDb.tokensV2.createMany({
        data: localTokens.map(localToken => ({
          id: localToken.address,
          network: localToken.network,
          name: localToken.name,
          symbol: localToken.symbol,
          decimals: localToken.decimals,
          wrappedAddress: localToken.wrappedAddress ?? null,
          maxSupply: localToken.maxSupply ?? null,
          circulatingSupply: localToken.circulatingSupply ?? null,
          minTradeVolume: localToken.minTradeVolume != null ? localToken.minTradeVolume.toString() : null,
        })),
        skipDuplicates: true,
      });
      logger.info(`[${network}] Synchronized ${result.count}/${localTokens.length} tokens to tokens_v2.`);
    } catch (e: any) {
      logger.error(`[${network}] Failed to insert tokens into tokens_v2: ${e.message}`);
    }
  }

  // ===== Pairs -> ammpair_v2 (only rows with a real pool address) =====
  const localPairs = await sqliteDb.pair.findMany({
    where: { network },
    include: { token0: true, token1: true },
  });

  if (localPairs.length > 0) {
    const pairValues = localPairs
      .filter(localPair => localPair.spikeyAmmPairAddress)
      .map(localPair => ({
        id: localPair.spikeyAmmPairAddress!,
        pair: localPair.spikeyAmmPairAddress!,
        network: localPair.network,
        creator: 'amm_indexer_sync',
        token0Address: localPair.token0.address,
        token1Address: localPair.token1.address,
        lpFeePercent: '0.003',
      }));

    if (pairValues.length > 0) {
      try {
        const result = await supabaseDb.ammpairV2.createMany({
          data: pairValues,
          skipDuplicates: true,
        });
        logger.info(`[${network}] Synchronized ${result.count}/${pairValues.length} pairs to ammpair_v2.`);
      } catch (e: any) {
        logger.error(`[${network}] Failed to insert pairs into ammpair_v2: ${e.message}`);
      }
    }
  }

  logger.info(`[${network}] Database synchronization finished.`);
  poller.resetNewSqliteDataCreated();
}
