import { sqliteDb, supabaseDb } from '../lib/prismadb';
import { createLogger } from '../app/indexer/utils';

const logger = createLogger('repair-sqlite');

const PAIR_ID_TO_FIX_IN_SQLITE = 1;

async function repairSqlite() {
  try {
    logger.info('Fetching canonical data for the correct Pair 1 from Supabase...');
    const canonicalSupabasePair = await supabaseDb.pair.findFirst({
        where: { 
            OR: [
                { token0: { symbol: 'SUPRA' }, token1: { symbol: 'dexUSDC' } },
                { token0: { symbol: 'dexUSDC' }, token1: { symbol: 'SUPRA' } },
            ]
        },
        include: { token0: true, token1: true }
    });

    if (!canonicalSupabasePair) {
        logger.error('Could not find the canonical SUPRA/dexUSDC pair in Supabase. Aborting.');
        return;
    }
    logger.info(`Found canonical pair in Supabase with ID: ${canonicalSupabasePair.id}. It is ${canonicalSupabasePair.token0.symbol}/${canonicalSupabasePair.token1.symbol}.`);

    // Simplified and more robust extraction of addresses
    let supraAddress: string;
    let dexUsdcAddress: string;

    if (canonicalSupabasePair.token0.symbol === 'SUPRA') {
        supraAddress = canonicalSupabasePair.token0.address;
        dexUsdcAddress = canonicalSupabasePair.token1.address;
    } else { // token0 is dexUSDC, token1 is SUPRA
        supraAddress = canonicalSupabasePair.token1.address;
        dexUsdcAddress = canonicalSupabasePair.token0.address;
    }

    logger.info(`[repair-sqlite] Extracted SUPRA address: ${supraAddress}`);
    logger.info(`[repair-sqlite] Extracted dexUSDC address: ${dexUsdcAddress}`);

    logger.info('Fetching corresponding token IDs from SQLite by ID...');
    const supraTokenSqlite = await sqliteDb.token.findUniqueOrThrow({ where: { id: 1 } }); // Try finding by ID
    logger.info(`[repair-sqlite] Found SUPRA token in SQLite by ID: ID=${supraTokenSqlite.id}, Symbol=${supraTokenSqlite.symbol}`);

    logger.info(`[repair-sqlite] Looking for dexUSDC token in SQLite with address: ${dexUsdcAddress}`);
    const dexUsdcTokenSqlite = await sqliteDb.token.findUniqueOrThrow({ where: { address: dexUsdcAddress } });
    logger.info(`[repair-sqlite] Found dexUSDC token in SQLite: ID=${dexUsdcTokenSqlite.id}, Symbol=${dexUsdcTokenSqlite.symbol}`);

    const [sortedToken0, sortedToken1] = [supraTokenSqlite, dexUsdcTokenSqlite].sort((a, b) => a.address.localeCompare(b.address));

    logger.info(`Target state for SQLite Pair ${PAIR_ID_TO_FIX_IN_SQLITE}: token0Id=${sortedToken0.id} (${sortedToken0.symbol}), token1Id=${sortedToken1.id} (${sortedToken1.symbol})`);

    await sqliteDb.$transaction(async (tx) => {
        logger.info(`[1/2] Deleting all existing relations for Pair ID ${PAIR_ID_TO_FIX_IN_SQLITE} in SQLite...`);
        await tx.ohlcData.deleteMany({ where: { pairId: PAIR_ID_TO_FIX_IN_SQLITE } });
        await tx.spikeyAmmSwap.deleteMany({ where: { pairId: PAIR_ID_TO_FIX_IN_SQLITE } });
        await tx.dexlynSwap.deleteMany({ where: { pairId: PAIR_ID_TO_FIX_IN_SQLITE } });
        logger.info('-> Deleted associated data.');

        logger.info(`[2/2] Updating Pair ID ${PAIR_ID_TO_FIX_IN_SQLITE} in SQLite with correct token IDs and null address...`);
        await tx.pair.update({
            where: { id: PAIR_ID_TO_FIX_IN_SQLITE },
            data: {
                token0Id: sortedToken0.id,
                token1Id: sortedToken1.id,
                spikeyAmmPairAddress: null,
            }
        });
        logger.info('-> Successfully repaired Pair 1.');
    });

    logger.info('--- SQLite Repair Complete ---');

  } catch (error) {
    logger.error('Error during SQLite repair:', error);
  } finally {
    await sqliteDb.$disconnect();
    await supabaseDb.$disconnect();
  }
}

repairSqlite();