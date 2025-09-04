import { PrismaClient } from '../prisma/dist/generated/supabase';
import { createLogger } from '../app/indexer/utils';

const prismadb = new PrismaClient();
const logger = createLogger('find-pair-id');

async function findPair(pairAddress: string) {
  if (!pairAddress) {
    logger.error('Pair address must be provided as an argument.');
    process.exit(1);
  }

  logger.info(`Searching for pair with address: ${pairAddress}`);

  try {
    const pair = await prismadb.pair.findFirst({
      where: {
        spikeyAmmPairAddress: pairAddress,
      },
      include: {
        token0: true,
        token1: true,
      },
    });

    if (pair) {
      logger.info('--- Found Pair ---');
      console.log(JSON.stringify(pair, (key, value) =>
        typeof value === 'bigint' ? value.toString() : value, 2));
      logger.info('--- End of Pair ---');
    } else {
      logger.info(`No pair found with address: ${pairAddress}`);
    }
  } catch (error: any) {
    logger.error('Error finding pair:', error.message, error.stack);
  } finally {
    await prismadb.$disconnect();
  }
}

const pairAddress = process.argv[2];
findPair(pairAddress);