import { sqliteDb, supabaseDb } from '../lib/prismadb';
import { createLogger } from '../app/indexer/utils';

const logger = createLogger('sync-supabase-to-sqlite');

async function syncDatabases() {
  try {
    logger.info('Starting synchronization from Supabase to SQLite...');

    // 1. Fetch all Tokens and Pairs from Supabase
    logger.info('Fetching Tokens from Supabase...');
    const supabaseTokens = await supabaseDb.token.findMany({ orderBy: { id: 'asc' } });
    logger.info(`-> Found ${supabaseTokens.length} Tokens in Supabase.`);

    logger.info('Fetching Pairs from Supabase...');
    const supabasePairs = await supabaseDb.pair.findMany({ orderBy: { id: 'asc' } });
    logger.info(`-> Found ${supabasePairs.length} Pairs in Supabase.`);

    // 2. Perform operations in a SQLite transaction
    await sqliteDb.$transaction(async (tx) => {
      logger.info('Clearing existing data in SQLite...');
      // Order of deletion matters due to foreign key constraints
      await tx.ohlcData.deleteMany({});
      await tx.spikeyAmmSwap.deleteMany({});
      await tx.dexlynSwap.deleteMany({});
      await tx.pair.deleteMany({});
      await tx.token.deleteMany({});
      logger.info('-> SQLite tables cleared.');

      // Map old Supabase Token IDs to new SQLite Token IDs
      const tokenMap = new Map<number, number>(); // supabaseId -> sqliteId

      // 3. Insert Tokens into SQLite
      logger.info('Inserting Tokens into SQLite...');
      for (const sToken of supabaseTokens) {
        const newSToken = await tx.token.create({
          data: {
            network: sToken.network,
            address: sToken.address,
            wrappedAddress: sToken.wrappedAddress,
            symbol: sToken.symbol,
            name: sToken.name,
            decimals: sToken.decimals,
            maxSupply: sToken.maxSupply,
            circulatingSupply: sToken.circulatingSupply,
            createdAt: sToken.createdAt,
          },
        });
        tokenMap.set(sToken.id, newSToken.id);
      }
      logger.info(`-> Inserted ${supabaseTokens.length} Tokens into SQLite.`);

      // 4. Insert Pairs into SQLite
      logger.info('Inserting Pairs into SQLite...');
      for (const sPair of supabasePairs) {
        const newT0Id = tokenMap.get(sPair.token0Id);
        const newT1Id = tokenMap.get(sPair.token1Id);

        if (newT0Id === undefined || newT1Id === undefined) {
          logger.error(`Missing token mapping for pair ${sPair.id}. Skipping.`);
          continue;
        }

        await tx.pair.create({
          data: {
            network: sPair.network,
            token0Id: newT0Id,
            token1Id: newT1Id,
            spikeyAmmPairAddress: sPair.spikeyAmmPairAddress,
            spikeyAmmReserve0: sPair.spikeyAmmReserve0,
            spikeyAmmReserve1: sPair.spikeyAmmReserve1,
            createdAt: sPair.createdAt,
          },
        });
      }
      logger.info(`-> Inserted ${supabasePairs.length} Pairs into SQLite.`);
    });

    logger.info('Synchronization from Supabase to SQLite complete.');

  } catch (error) {
    logger.error('Error during synchronization:', error);
  } finally {
    await sqliteDb.$disconnect();
    await supabaseDb.$disconnect();
  }
}

syncDatabases();
