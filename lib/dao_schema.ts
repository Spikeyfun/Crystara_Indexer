import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

// 1. DAOs Table (populated from Petra module events)
export const daos = sqliteTable("daos", {
  id: text("id").primaryKey(), // We use UUIDs as strings in SQLite
  daoAddress: text("dao_address").notNull().unique(), // The 0x address of the DAO's main object/FA
  assetAddress: text("asset_address").unique(), // The 0x address of the DAO's governance token
  creatorAddress: text("creator_address").notNull(),
  name: text("name").notNull(),
  symbol: text("symbol").notNull(),
  description: text("description"),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
  
  // Cached states from blockchain
  totalValueLocked: text("total_value_locked").default('0'),
  isPaused: integer("is_paused", { mode: "boolean" }).default(false),
});

// 2. Proposals Table (populated from Herald and Ledger module events)
export const proposals = sqliteTable("proposals", {
  id: text("id").primaryKey(),
  daoAddress: text("dao_address").references(() => daos.daoAddress, { onDelete: 'cascade' }),
  proposalId: integer("proposal_id").notNull(), // The on-chain proposal ID
  proposerAddress: text("proposer_address").notNull(),
  title: text("title").notNull().default("Untitled Proposal"),
  description: text("description").notNull().default("No description provided."),
  metadataUri: text("metadata_uri").notNull(),
  executionHash: text("execution_hash").notNull(),
  status: text("status").default('Pending').notNull(),
  votesFor: text("votes_for").default('0'),
  votesAgainst: text("votes_against").default('0'),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
  startTime: integer("start_time", { mode: "timestamp" }).notNull(),
  endTime: integer("end_time", { mode: "timestamp" }).notNull(),
});

// 3. Votes Table (populated from Witness module events)
export const votes = sqliteTable("votes", {
  id: text("id").primaryKey(),
  proposalId: text("proposal_id").references(() => proposals.id, { onDelete: 'cascade' }),
  voterAddress: text("voter_address").notNull(),
  support: integer("support", { mode: "boolean" }).notNull(), // True = For, False = Against
  votingWeight: text("voting_weight").notNull(),
  timestamp: integer("timestamp", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

// 4. veToken Stakes Table (populated from Legacy module events)
export const stakes = sqliteTable("stakes", {
  id: text("id").primaryKey(),
  veTokenAddress: text("ve_token_address").notNull().unique(), // The 0x4 Object address of the NFT
  ownerAddress: text("owner_address").notNull(),
  daoAddress: text("dao_address").references(() => daos.daoAddress, { onDelete: 'cascade' }),
  lockedAmount: text("locked_amount").notNull(),
  lockDurationSeconds: integer("lock_duration_seconds").notNull(),
  unlockTime: integer("unlock_time", { mode: "timestamp" }).notNull(),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

// ==========================================
// ECONOMIC ENGINE (veTokenomics)
// ==========================================

export const epochs = sqliteTable("epochs", {
  id: text("id").primaryKey(), // e.g. "daoAddress-pilgrim"
  daoAddress: text("dao_address").references(() => daos.daoAddress, { onDelete: 'cascade' }),
  pilgrim: integer("pilgrim").notNull(), // The epoch/week number
  totalMinted: text("total_minted").default('0'), // Emissions minted
  gaugeAmount: text("gauge_amount").default('0'), // Emissions sent to gauges
  rebaseAmount: text("rebase_amount").default('0'), // Emissions sent to rebases
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

export const gauges = sqliteTable("gauges", {
  id: text("id").primaryKey(), // e.g. "daoAddress-gaugeId"
  daoAddress: text("dao_address").references(() => daos.daoAddress, { onDelete: 'cascade' }),
  gaugeId: integer("gauge_id").notNull(),
  destination: text("destination").notNull(), // The LP or Vault address receiving emissions
  totalVotes: text("total_votes").default('0'), // Cached total power voted for this gauge
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

export const bribes = sqliteTable("bribes", {
  id: text("id").primaryKey(), // UUID
  daoAddress: text("dao_address").references(() => daos.daoAddress, { onDelete: 'cascade' }),
  gaugeId: integer("gauge_id").notNull(),
  pilgrim: integer("pilgrim").notNull(), // The epoch this bribe is for
  tokenAddress: text("token_address").notNull(), // The token used for bribing (e.g. USDC)
  depositorAddress: text("depositor_address").notNull(),
  amount: text("amount").notNull(),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

export const gaugeVotes = sqliteTable("gauge_votes", {
  id: text("id").primaryKey(),
  daoAddress: text("dao_address").references(() => daos.daoAddress, { onDelete: 'cascade' }),
  pilgrim: integer("pilgrim").notNull(),
  voterAddress: text("voter_address").notNull(),
  legacyAddress: text("legacy_address").notNull(), // The veToken lock used
  powerUsed: text("power_used").notNull(),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

export const rewardClaims = sqliteTable("reward_claims", {
  id: text("id").primaryKey(),
  daoAddress: text("dao_address").references(() => daos.daoAddress, { onDelete: 'cascade' }),
  claimerAddress: text("claimer_address").notNull(),
  type: text("type").notNull(), // 'Bribe' or 'Rebase'
  tokenAddress: text("token_address").notNull(),
  amount: text("amount").notNull(),
  claimedAt: integer("claimed_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});
