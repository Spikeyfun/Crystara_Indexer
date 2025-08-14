import { supabaseDb } from '../lib/prismadb';

const TOKEN_ADDRESS_TO_DELETE = '0x8fd1550a61055c1406e04d1a0ddf7049d00c889b59f6823f21ca7d842e1eaf3c';

async function cleanupOhlcData() {
  console.log(`--- Starting cleanup of OhlcData for token: ${TOKEN_ADDRESS_TO_DELETE} ---`);

  try {
    const result = await supabaseDb.ohlcData.deleteMany({
      where: {
        token1Address: TOKEN_ADDRESS_TO_DELETE,
      },
    });

    console.log(`Successfully deleted ${result.count} records from OhlcData.`);
    console.log('\n--- Cleanup Script Finished Successfully ---');

  } catch (error) {
    console.error('An error occurred during the cleanup script:', error);
    process.exit(1);
  } finally {
    await supabaseDb.$disconnect();
  }
}

cleanupOhlcData().catch((e) => {
  console.error('An unexpected error occurred:', e);
  process.exit(1);
});
