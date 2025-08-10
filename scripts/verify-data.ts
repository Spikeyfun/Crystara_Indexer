import { supabaseDb as prismadb } from '../lib/prismadb';
import { createLogger } from '../app/indexer/utils';

const logger = createLogger('verify-pairs');

async function verify() {
  try {
    const allPairs = await prismadb.pair.findMany({
      include: {
        token0: true,
        token1: true,
      },
      orderBy: {
        id: 'asc',
      }
    });

    logger.info(`Found ${allPairs.length} pairs in Supabase. Listing them individually:`);
    for (const pair of allPairs) {
      logger.info(JSON.stringify(pair, null, 2));
    }
    logger.info('--- End of pair list ---');

  } catch (error: any) {
    logger.error('Error verifying pairs:', error.message, error.stack);
  } finally {
    await prismadb.$disconnect();
  }
}

verify();
