import { PrismaClient as SupabasePrismaClient } from '../prisma/generated/supabase';
import { PrismaClient as SqlitePrismaClient } from '../prisma/generated/sqlite';

const supabase = new SupabasePrismaClient();
const sqlite = new SqlitePrismaClient();

async function main() {
  const cutoffDate = new Date('2025-09-05T21:00:00.000Z');
  console.log(`Re-running cleanup for all data created after: ${cutoffDate.toISOString()}`);

  // Supabase OhlcData cleanup (using createdAt)
  console.log('Deleting from OhlcData in Supabase (using createdAt)...');
  const supabaseOhlcResult = await supabase.ohlcData.deleteMany({
    where: {
      createdAt: {
        gte: cutoffDate,
      },
    },
  });
  console.log(`Deleted ${supabaseOhlcResult.count} records from Supabase OhlcData.`);

  // SQLite OhlcData cleanup (using createdAt for consistency)
  console.log('Deleting from OhlcData in SQLite (using createdAt)...');
  const sqliteOhlcResult = await sqlite.ohlcData.deleteMany({
    where: {
      createdAt: {
        gte: cutoffDate,
      },
    },
  });
  console.log(`Deleted ${sqliteOhlcResult.count} records from SQLite OhlcData.`);

  // SQLite DexlynSwap cleanup (using processedAt)
  console.log('Deleting from DexlynSwap in SQLite (using processedAt)...');
  const sqliteDexlynResult = await sqlite.dexlynSwap.deleteMany({
    where: {
      processedAt: {
        gte: cutoffDate,
      },
    },
  });
  console.log(`Deleted ${sqliteDexlynResult.count} records from SQLite DexlynSwap.`);
}

main()
  .then(async () => {
    await supabase.$disconnect();
    await sqlite.$disconnect();
    console.log('Cleanup re-run complete.');
  })
  .catch(async (e) => {
    console.error('An error occurred during cleanup:', e);
    await supabase.$disconnect();
    await sqlite.$disconnect();
    process.exit(1);
  });
