import { sqliteDb as prismadb } from '../lib/prismadb';
import { createLogger } from '../app/indexer/utils';

const logger = createLogger('fix-local-db');

const PAIR_ID_TO_FIX = 1;

async function fixLocalData() {
  logger.info(`Starting local SQLite data correction for pairId: ${PAIR_ID_TO_FIX}`);

  try {
    const transactionResult = await prismadb.$transaction(async (tx) => {
      logger.info(`[1/2] Deleting all OhlcData records from local SQLite for pairId: ${PAIR_ID_TO_FIX}...`);
      const deletedOhlc = await tx.ohlcData.deleteMany({
        where: {
          pairId: PAIR_ID_TO_FIX,
        },
      });
      logger.info(`-> Deleted ${deletedOhlc.count} local OhlcData records.`);

      logger.info(`[2/2] Updating local Pair record ${PAIR_ID_TO_FIX} to set spikeyAmmPairAddress to null...`);
      const updatedPair = await tx.pair.update({
        where: {
          id: PAIR_ID_TO_FIX,
        },
        data: {
          spikeyAmmPairAddress: null,
        },
      });
      logger.info(`-> Successfully updated local pair ${updatedPair.id}.`);

      return { deletedOhlc, updatedPair };
    });

    logger.info('--- Local DB Correction Summary ---');
    logger.info(`Total local OhlcData records deleted: ${transactionResult.deletedOhlc.count}`);
    logger.info(`Local Pair ${transactionResult.updatedPair.id} was successfully reset.`);
    logger.info('-----------------------------------');
    logger.info('Local database correction complete.');

  } catch (error) {
    logger.error('Error during local data correction transaction:', error);
    logger.error('Transaction was rolled back. No data was changed in local DB.');
  } finally {
    await prismadb.$disconnect();
  }
}

fixLocalData();
