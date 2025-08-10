import { supabaseDb } from '../lib/prismadb';

async function clearSupabaseDb() {
  console.log('--- Clearing Supabase DB Tables ---');

  try {
    console.log('Deleting records from OhlcData...');
    await supabaseDb.ohlcData.deleteMany({});
    console.log('OhlcData cleared.');

    console.log('Deleting records from Pair...');
    await supabaseDb.pair.deleteMany({});
    console.log('Pair cleared.');

    console.log('Deleting records from Token...');
    await supabaseDb.token.deleteMany({});
    console.log('Token cleared.');

    console.log('Deleting records from EventTracking...');
    await supabaseDb.eventTracking.deleteMany({});
    console.log('EventTracking cleared.');

    console.log('\n--- Supabase DB Tables Cleared Successfully ---');

  } catch (error) {
    console.error('An error occurred while clearing Supabase DB:', error);
    process.exit(1);
  } finally {
    await supabaseDb.$disconnect();
  }
}

clearSupabaseDb().catch((e) => {
  console.error('An unexpected error occurred:', e);
  process.exit(1);
});
