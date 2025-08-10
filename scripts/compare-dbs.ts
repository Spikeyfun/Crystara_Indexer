import { sqliteDb, supabaseDb } from '../lib/prismadb';
import { createLogger } from '../app/indexer/utils';

const logger = createLogger('compare-dbs');

// Helper to create a canonical key for a pair based on sorted token addresses
function getPairKey(pair: any): string {
    if (!pair.token0 || !pair.token1) return `invalid-pair-id-${pair.id}`;
    const addresses = [pair.token0.address, pair.token1.address].sort();
    return `${addresses[0]}:${addresses[1]}`;
}

async function compareDatabases() {
  try {
    logger.info('Fetching all pairs from SQLite...');
    const sqlitePairs = await sqliteDb.pair.findMany({
      include: { token0: true, token1: true },
    });
    logger.info(`-> Found ${sqlitePairs.length} pairs in SQLite.`);

    logger.info('Fetching all pairs from Supabase...');
    const supabasePairs = await supabaseDb.pair.findMany({
      include: { token0: true, token1: true },
    });
    logger.info(`-> Found ${supabasePairs.length} pairs in Supabase.`);

    const sqlitePairMap = new Map<string, any>();
    for (const pair of sqlitePairs) {
        sqlitePairMap.set(getPairKey(pair), pair);
    }

    const supabasePairMap = new Map<string, any>();
    for (const pair of supabasePairs) {
        supabasePairMap.set(getPairKey(pair), pair);
    }

    const onlyInSqlite: string[] = [];
    const onlyInSupabase: string[] = [];
    const inBoth: string[] = [];
    const addressMismatches: any[] = [];

    for (const [key, pair] of sqlitePairMap.entries()) {
        if (supabasePairMap.has(key)) {
            inBoth.push(key);
            const supabasePair = supabasePairMap.get(key)!;
            if (pair.spikeyAmmPairAddress !== supabasePair.spikeyAmmPairAddress) {
                addressMismatches.push({
                    key,
                    sqliteId: pair.id,
                    supabaseId: supabasePair.id,
                    sqliteAddress: pair.spikeyAmmPairAddress,
                    supabaseAddress: supabasePair.spikeyAmmPairAddress,
                });
            }
        } else {
            onlyInSqlite.push(key);
        }
    }

    for (const key of supabasePairMap.keys()) {
        if (!sqlitePairMap.has(key)) {
            onlyInSupabase.push(key);
        }
    }

    logger.info('\n--- Comparison Report ---');
    logger.info(`Pairs in both databases: ${inBoth.length}`);
    logger.info(`Pairs only in SQLite: ${onlyInSqlite.length}`);
    if (onlyInSqlite.length > 0) logger.info(' -> ' + onlyInSqlite.join('\n -> '));
    logger.info(`Pairs only in Supabase: ${onlyInSupabase.length}`);
    if (onlyInSupabase.length > 0) logger.info(' -> ' + onlyInSupabase.join('\n -> '));
    logger.info(`Pairs with spikeyAmmPairAddress mismatch: ${addressMismatches.length}`);
    if (addressMismatches.length > 0) {
      logger.info('Mismatched Pairs Details:');
      console.log(JSON.stringify(addressMismatches, null, 2));
    }
    logger.info('-----------------------\n');

  } catch (error) {
    logger.error('Error during database comparison:', error);
  } finally {
    await sqliteDb.$disconnect();
    await supabaseDb.$disconnect();
  }
}

compareDatabases();
