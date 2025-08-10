import { sqliteDb } from '@/lib/prismadb';
import { createLogger } from '@/app/indexer/utils';

const logger = createLogger('db-cleanup');

const RETENTION_DAYS = 7;

export async function executeDbCleanup() {
  logger.info('Starting database cleanup task for old records...');

  const retentionDate = new Date();
  retentionDate.setDate(retentionDate.getDate() - RETENTION_DAYS);

  logger.info(`Deleting records older than ${retentionDate.toISOString()}`);

  try {
    // Cleanup old swaps
    const deletedDexlynSwaps = await sqliteDb.dexlynSwap.deleteMany({
      where: {
        blockTimestamp: { lt: retentionDate },
      },
    });

    const deletedSpikeySwaps = await sqliteDb.spikeyAmmSwap.deleteMany({
      where: {
        blockTimestamp: { lt: retentionDate },
      },
    });

    // Cleanup old 1m OHLC data
    const deletedOhlc1m = await sqliteDb.ohlcData.deleteMany({
      where: {
        timeframe: '1m',
        timestamp: { lt: retentionDate },
      },
    });

    logger.info({
      message: 'Database cleanup successful.',
      deletedDexlynSwaps: deletedDexlynSwaps.count,
      deletedSpikeySwaps: deletedSpikeySwaps.count,
      deletedOhlc1m: deletedOhlc1m.count,
    }, 'DB Cleanup Stats');

  } catch (error) {
    logger.error('Error during database cleanup:', error);
  }
}
