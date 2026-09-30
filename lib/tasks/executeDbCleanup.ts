import { sqliteDb, supabaseDb } from '@/lib/prismadb';
import { createLogger } from '@/app/indexer/utils';

const logger = createLogger('db-cleanup');

const RETENTION_DAYS = 7;

// Supabase OHLC retention. 5m candles are the ones that grow unbounded; the
// bot consumes 5m/1h/1d but only needs recent history. Runs daily so each run
// deletes ~1 day worth of rows (cheap). Set to 0 to disable.
const SUPABASE_5M_RETENTION_DAYS = parseInt(process.env.SUPABASE_OHLC_5M_RETENTION_DAYS || '180', 10);
const SUPABASE_1H_RETENTION_DAYS = parseInt(process.env.SUPABASE_OHLC_1H_RETENTION_DAYS || '0', 10);

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

  // --- Supabase OHLC retention (keeps the growing 5m table bounded) ---
  try {
    if (SUPABASE_5M_RETENTION_DAYS > 0) {
      const cutoff5m = new Date();
      cutoff5m.setDate(cutoff5m.getDate() - SUPABASE_5M_RETENTION_DAYS);
      const deletedOhlc5m = await supabaseDb.ohlcData.deleteMany({
        where: { timeframe: '5m', timestamp: { lt: cutoff5m } },
      });
      logger.info({ message: 'Supabase 5m OHLC retention', retentionDays: SUPABASE_5M_RETENTION_DAYS, deletedOhlc5m: deletedOhlc5m.count }, 'DB Cleanup Stats');
    }

    if (SUPABASE_1H_RETENTION_DAYS > 0) {
      const cutoff1h = new Date();
      cutoff1h.setDate(cutoff1h.getDate() - SUPABASE_1H_RETENTION_DAYS);
      const deletedOhlc1h = await supabaseDb.ohlcData.deleteMany({
        where: { timeframe: '1h', timestamp: { lt: cutoff1h } },
      });
      logger.info({ message: 'Supabase 1h OHLC retention', retentionDays: SUPABASE_1H_RETENTION_DAYS, deletedOhlc1h: deletedOhlc1h.count }, 'DB Cleanup Stats');
    }
  } catch (error) {
    logger.error('Error during Supabase OHLC retention cleanup:', error);
  }
}
