import { PrismaClient } from '../prisma/generated/supabase';

const prismadb = new PrismaClient();
const logger = {
  info: (message: string) => console.log(`[INFO] ${message}`),
  error: (message: string, error?: any) => console.error(`[ERROR] ${message}`, error),
  log: (message: string) => console.log(message),
};

async function inspectOhlcData() {
  logger.info('Starting script to inspect OHLC data for a specific pair...');

  const pairId = 1277;

  try {
    logger.info(`Fetching last 10 OHLC records for Pair ID: ${pairId}...`);

    const ohlcData = await prismadb.ohlcData.findMany({
      where: {
        pairId: pairId,
      },
      orderBy: {
        timestamp: 'desc',
      },
      take: 10,
    });

    if (ohlcData.length === 0) {
      logger.info(`No OHLC data found for Pair ID: ${pairId}`);
    } else {
      logger.log('\n--- Fetched OHLC Data ---');
      ohlcData.forEach((data: any) => {
        logger.log(
          `Timestamp: ${data.timestamp.toISOString()}, ` +
          `PairID: ${data.pairId}, ` +
          `Source: ${data.ammSource}, ` +
          `Open: ${data.open}, ` +
          `High: ${data.high}, ` +
          `Low: ${data.low}, ` +
          `Close: ${data.close}`
        );
      });
      logger.log('--- End of Data ---\n');
    }
  } catch (error) {
    logger.error('An error occurred during script execution:', error);
  } finally {
    await prismadb.$disconnect();
  }
}

insp ectOhlcData().catch(e => {
  logger.error('Script failed unexpectedly.', e);
  process.exit(1);
});