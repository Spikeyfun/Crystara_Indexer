import { getDb, tokens_v2 } from '../lib/drizzle';
import { inArray } from 'drizzle-orm';
import * as dotenv from 'dotenv';
dotenv.config();

async function main() {
  try {
    console.log("Connecting...");
    const db = await getDb();
    console.log("Querying...");
    const tokens = await db.select().from(tokens_v2).limit(1);
    console.log("Result:", tokens);
  } catch (e) {
    console.error("ERROR:", e);
  }
  process.exit(0);
}
main();
