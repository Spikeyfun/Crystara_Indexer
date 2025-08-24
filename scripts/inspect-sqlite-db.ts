import { sqliteDb } from '../lib/prismadb';

import { sqliteDb } from '../lib/prismadb';

import { sqliteDb } from '../lib/prismadb';

async function inspectDb() {
  console.log('--- Inspecting Pair ID 3 in SQLite ---');

  try {
    const pair = await sqliteDb.pair.findUnique({
      where: {
        id: 3,
      },
    });

    if (!pair) {
      console.log('Pair ID 3 not found in SQLite.');
    } else {
      console.log('Pair ID 3 found in SQLite:');
      console.log(pair);
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

inspectDb().catch((e) => {
  console.error('An unexpected error occurred:', e);
  process.exit(1);
});