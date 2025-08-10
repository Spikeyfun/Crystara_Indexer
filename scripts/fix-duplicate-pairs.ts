import { sqliteDb as prismadb } from '../lib/prismadb';
import { createLogger } from '../app/indexer/utils';

const logger = createLogger('fix-duplicates');

async function findAndFixDuplicates() {
  logger.info('Starting duplicate pair check in local SQLite DB...');

  const allPairs = await prismadb.pair.findMany({
    select: {
      id: true,
      token0Id: true,
      token1Id: true,
    },
  });

  const canonicalPairs = new Map<string, number>(); // Key: "tokenID1-tokenID2", Value: pairId
  const duplicatesToDelete: number[] = [];

  for (const pair of allPairs) {
    const key = [pair.token0Id, pair.token1Id].sort((a, b) => a - b).join('-');

    if (canonicalPairs.has(key)) {
      const existingPairId = canonicalPairs.get(key)!;
      if (pair.id > existingPairId) {
        duplicatesToDelete.push(pair.id);
      } else {
        duplicatesToDelete.push(existingPairId);
        canonicalPairs.set(key, pair.id);
      }
    } else {
      canonicalPairs.set(key, pair.id);
    }
  }

  if (duplicatesToDelete.length === 0) {
    logger.info('No duplicate pairs found in SQLite. Database is clean.');
    await prismadb.$disconnect();
    return;
  }

  logger.warn(`Found ${duplicatesToDelete.length} duplicate pairs to delete from SQLite: ${duplicatesToDelete.join(', ')}`);

  try {
    await prismadb.$transaction(async (tx) => {
      logger.info(`[1/4] Deleting OhlcData for duplicate pair IDs: ${duplicatesToDelete.join(', ')}...`);
      const deletedOhlc = await tx.ohlcData.deleteMany({
        where: { pairId: { in: duplicatesToDelete } },
      });
      logger.info(`-> Deleted ${deletedOhlc.count} OhlcData records.`);

      logger.info(`[2/4] Deleting SpikeyAmmSwap records for duplicate pair IDs...`);
      const deletedSpikeySwaps = await tx.spikeyAmmSwap.deleteMany({
        where: { pairId: { in: duplicatesToDelete } },
      });
      logger.info(`-> Deleted ${deletedSpikeySwaps.count} SpikeyAmmSwap records.`);

      logger.info(`[3/4] Deleting DexlynSwap records for duplicate pair IDs...`);
      const deletedDexlynSwaps = await tx.dexlynSwap.deleteMany({
        where: { pairId: { in: duplicatesToDelete } },
      });
      logger.info(`-> Deleted ${deletedDexlynSwaps.count} DexlynSwap records.`);

      logger.info(`[4/4] Deleting ${duplicatesToDelete.length} duplicate Pair records...`);
      const deletedPairs = await tx.pair.deleteMany({
        where: { id: { in: duplicatesToDelete } },
      });
      logger.info(`-> Deleted ${deletedPairs.count} Pair records.`);
    });

    logger.info('--- SQLite Duplicate Cleanup Summary ---');
    logger.info(`Successfully deleted ${duplicatesToDelete.length} duplicate pairs and all their associated data from SQLite.`);
    logger.info('----------------------------------------');

  } catch (error) {
    logger.error('Error during SQLite duplicate cleanup transaction:', error);
  } finally {
    await prismadb.$disconnect();
  }
}

findAndFixDuplicates();