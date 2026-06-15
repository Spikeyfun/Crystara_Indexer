// @ts-ignore
import { drizzle } from 'drizzle-orm/node-postgres';
import { Client } from 'pg';
// @ts-ignore
import { pgTable, text, numeric, timestamp, integer, boolean, unique } from "drizzle-orm/pg-core";
import * as dotenv from 'dotenv';
dotenv.config();

export const tokens_v2 = pgTable("tokens_v2", {
  id: text("id").primaryKey(), // Token address
  network: text("network").notNull(),
  name: text("name").notNull(),
  symbol: text("symbol").notNull(),
  decimals: integer("decimals").notNull(),
});

export const ammpair_v2 = pgTable("ammpair_v2", {
  id: text("id").primaryKey(), // Pool unique ID inside the app
  pair: text("pair").notNull(), // Pool address on-chain
  network: text("network").notNull(),
  creator: text("creator").notNull(),
  token0Address: text("token0Address").references(() => tokens_v2.id).notNull(),
  token1Address: text("token1Address").references(() => tokens_v2.id).notNull(),
  lpFeePercent: numeric("lpFeePercent", { precision: 10, scale: 4 }).notNull(), // e.g. 0.003
  verified: boolean("verified").default(false).notNull(),
  displayOrder: integer("displayOrder").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
}, (t) => ({
  unq_pair_network: unique().on(t.pair, t.network)
}));

export const dbClient = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

let dbInstance: any = null;
let isConnected = false;

export async function getDb() {
  if (!dbInstance) {
    if (!isConnected) {
        await dbClient.connect();
        isConnected = true;
    }
    dbInstance = drizzle(dbClient);
  }
  return dbInstance!;
}
