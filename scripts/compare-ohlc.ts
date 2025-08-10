import { sqliteDb, supabaseDb } from '../lib/prismadb';

const logger = {
  info: (message: string) => console.log(`[INFO] ${message}`),
  error: (message: string, error?: any) => console.error(`[ERROR] ${message}`, error),
  log: (message: string) => console.log(message),
};

const SQLITE_PAIR_ID = 6;
const SUPABASE_PAIR_ID = 9;

async function compareOhlcData() {
  logger.info(`Comparing OHLC data for SPIKE/SUPRA pair...`);
  logger.info(`SQLite Pair ID: ${SQLITE_PAIR_ID}`);
  logger.info(`Supabase Pair ID: ${SUPABASE_PAIR_ID}`);

  try {
    const [sqliteData, supabaseData] = await Promise.all([
      sqliteDb.ohlcData.findMany({
        where: { pairId: SQLITE_PAIR_ID, timeframe: '1m' },
        orderBy: { timestamp: 'desc' },
        take: 10,
      }),
      supabaseDb.ohlcData.findMany({
        where: { pairId: SUPABASE_PAIR_ID, timeframe: '5m' }, // Assuming we compare 5m data in Supabase
        orderBy: { timestamp: 'desc' },
        take: 10,
      }),
    ]);

    logger.log('\n--- Data from SQLite (1m OHLC) ---');
    if (sqliteData.length === 0) {
      logger.log('No data found in SQLite.');
    } else {
      sqliteData.forEach((data: any) => {
        logger.log(
          `Timestamp: ${data.timestamp.toISOString()}, ` +
          `Source: ${data.ammSource}, ` +
          `Open: ${data.open}, ` +
          `Close: ${data.close}`
        );
      });
    }
    logger.log('--- End of SQLite Data ---\n');


    logger.log('\n--- Data from Supabase (5m OHLC) ---');
    if (supabaseData.length === 0) {
      logger.log('No data found in Supabase.');
    } else {
      supabaseData.forEach((data: any) => {
        logger.log(
          `Timestamp: ${data.timestamp.toISOString()}, ` +
          `Source: ${data.ammSource}, ` +
          `Open: ${data.open}, ` +
          `Close: ${data.close}`
        );
      });
    }
    logger.log('--- End of Supabase Data ---\n');

  } catch (error) {
    logger.error('An error occurred during script execution:', error);
  } finally {
    await sqliteDb.$disconnect();
    await supabaseDb.$disconnect();
  }
}

compareOhlcData().catch(e => {
  logger.error('Script failed unexpectedly.', e);
  process.exit(1);
});
