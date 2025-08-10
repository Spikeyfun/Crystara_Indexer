import { sqliteDb, supabaseDb } from '../lib/prismadb';

async function compareDbIds() {
  console.log('--- Comparing IDs and Data between SQLite and Supabase ---');

  // Focus only on 'token' table for detailed data comparison
  const tableName = 'token';
  console.log(`
--- Comparing table: ${tableName} ---`);
  try {
    // Fetch all data from SQLite
    const sqliteRecords = await sqliteDb.token.findMany({
      orderBy: { id: 'asc' },
    });
    const sqliteMap = new Map(sqliteRecords.map(record => [record.id, record]));

    // Fetch all data from Supabase
    const supabaseRecords = await supabaseDb.token.findMany({
      orderBy: { id: 'asc' },
    });
    const supabaseMap = new Map(supabaseRecords.map(record => [record.id, record]));

    console.log(`SQLite ${tableName} count: ${sqliteRecords.length}`);
    console.log(`Supabase ${tableName} count: ${supabaseRecords.length}`);

    let discrepanciesFound = false;

    // Compare IDs and data
    for (const [id, sqliteRecord] of sqliteMap.entries()) {
      const supabaseRecord = supabaseMap.get(id);

      if (!supabaseRecord) {
        console.log(`  Discrepancy: ID ${id} found in SQLite but missing in Supabase.`);
        discrepanciesFound = true;
        continue;
      }

      // Compare data fields (excluding createdAt and updatedAt as they can differ)
      const fieldsToCompare = ['network', 'address', 'wrappedAddress', 'symbol', 'name', 'decimals', 'maxSupply', 'circulatingSupply'];
      let recordMismatch = false;
      for (const field of fieldsToCompare) {
        // Handle BigInt comparison
        const sqliteValue = (sqliteRecord as any)[field];
        const supabaseValue = (supabaseRecord as any)[field];

        let valuesMatch = true;
        if (typeof sqliteValue === 'bigint' && typeof supabaseValue === 'bigint') {
            valuesMatch = sqliteValue.toString() === supabaseValue.toString();
        } else {
            valuesMatch = sqliteValue === supabaseValue;
        }

        if (!valuesMatch) {
          console.log(`  Discrepancy for ID ${id}, field '${field}': SQLite='${sqliteValue}', Supabase='${supabaseValue}'`);
          recordMismatch = true;
        }
      }
      if (recordMismatch) {
        discrepanciesFound = true;
      }
    }

    // Check for records in Supabase but missing in SQLite
    for (const [id, supabaseRecord] of supabaseMap.entries()) {
      if (!sqliteMap.has(id)) {
        console.log(`  Discrepancy: ID ${id} found in Supabase but missing in SQLite.`);
        discrepanciesFound = true;
      }
    }

    if (!discrepanciesFound) {
      console.log(`IDs and data are perfectly consistent for ${tableName}.`);
    }

  } catch (error) {
    console.error(`Error comparing table ${tableName}:`, error);
  }

  await sqliteDb.$disconnect();
  await supabaseDb.$disconnect();
  console.log('--- Comparison Complete ---');
}

compareDbIds().catch((e) => {
  console.error('An unexpected error occurred:', e);
  process.exit(1);
});
