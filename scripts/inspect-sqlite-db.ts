import { sqliteDb } from '../lib/prismadb';

async function inspectDb() {
  console.log('--- Listing Pair IDs with 1m OHLC Data in SQLite ---');

  try {
    const pairIdsWith1mOhlc = await sqliteDb.ohlcData.findMany({
      where: { timeframe: '1m' },
      select: { pairId: true },
      distinct: ['pairId'],
      orderBy: { pairId: 'asc' },
    });

    if (pairIdsWith1mOhlc.length === 0) {
      console.log('No 1m OHLC data found for any pair in SQLite.');
    } else {
      console.log('Pair IDs with 1m OHLC data:');
      pairIdsWith1mOhlc.forEach(p => console.log(`- ${p.pairId}`));
    }

  } catch (error) {
    console.error('An unexpected error occurred:', error);
    process.exit(1);
  } finally {
    await sqliteDb.$disconnect();
  }
}

inspectDb().catch((e) => {
  console.error('An unexpected error occurred:', e);
  process.exit(1);
});