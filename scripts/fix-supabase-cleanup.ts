import { PrismaClient as SupabasePrismaClient } from '../prisma/generated/supabase';

const supabase = new SupabasePrismaClient();

async function main() {
  const cutoffDate = new Date('2025-09-05T21:00:00.000Z');
  console.log(`Cutoff date is: ${cutoffDate.toISOString()}`);

  // OhlcData cleanup in Supabase using createdAt
  console.log('Deleting from OhlcData in Supabase using createdAt...');
  const supabaseOhlcResult = await supabase.ohlcData.deleteMany({
    where: {
      createdAt: {
        gte: cutoffDate,
      },
    },
  });
  console.log(`Deleted ${supabaseOhlcResult.count} records from Supabase OhlcData.`);
}

main()
  .then(async () => {
    await supabase.$disconnect();
    console.log('Cleanup complete.');
  })
  .catch(async (e) => {
    console.error('An error occurred during cleanup:', e);
    await supabase.$disconnect();
    process.exit(1);
  });
