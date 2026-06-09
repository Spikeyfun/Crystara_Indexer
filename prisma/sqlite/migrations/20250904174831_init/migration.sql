-- CreateTable
CREATE TABLE "EventTracking" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "eventType" TEXT NOT NULL,
    "blockHeight" BIGINT NOT NULL,
    "transactionHash" TEXT NOT NULL,
    "processed" BOOLEAN NOT NULL DEFAULT false,
    "error" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "network" TEXT NOT NULL,
    "sequenceNumber" TEXT
);

-- CreateTable
CREATE TABLE "SpikeyAmmSwap" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "network" TEXT NOT NULL,
    "transactionHash" TEXT NOT NULL,
    "eventIndex" INTEGER NOT NULL,
    "blockNumber" BIGINT NOT NULL,
    "blockTimestamp" DATETIME NOT NULL,
    "sender" TEXT NOT NULL,
    "to" TEXT NOT NULL,
    "amount0In" BIGINT NOT NULL,
    "amount1In" BIGINT NOT NULL,
    "amount0Out" BIGINT NOT NULL,
    "amount1Out" BIGINT NOT NULL,
    "processedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "pairId" INTEGER NOT NULL,
    CONSTRAINT "SpikeyAmmSwap_pairId_fkey" FOREIGN KEY ("pairId") REFERENCES "Pair" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "DexlynSwap" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "network" TEXT NOT NULL,
    "transactionHash" TEXT NOT NULL,
    "sequenceNumber" TEXT NOT NULL,
    "blockNumber" BIGINT NOT NULL,
    "blockTimestamp" DATETIME NOT NULL,
    "curve" TEXT NOT NULL,
    "xIn" BIGINT NOT NULL,
    "xOut" BIGINT NOT NULL,
    "yIn" BIGINT NOT NULL,
    "yOut" BIGINT NOT NULL,
    "timestamp" BIGINT NOT NULL,
    "reserveX" BIGINT NOT NULL,
    "reserveY" BIGINT NOT NULL,
    "processedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "pairId" INTEGER NOT NULL,
    CONSTRAINT "DexlynSwap_pairId_fkey" FOREIGN KEY ("pairId") REFERENCES "Pair" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Token" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "network" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "wrappedAddress" TEXT,
    "symbol" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "decimals" INTEGER NOT NULL,
    "maxSupply" BIGINT,
    "circulatingSupply" BIGINT,
    "minTradeVolume" DECIMAL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "Pair" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "network" TEXT NOT NULL,
    "token0Id" INTEGER NOT NULL,
    "token1Id" INTEGER NOT NULL,
    "spikeyAmmPairAddress" TEXT,
    "spikeyAmmReserve0" BIGINT,
    "spikeyAmmReserve1" BIGINT,
    "lastStatsUpdate" DATETIME,
    "spikeyAmmToken0Address" TEXT,
    "dexlynAmmTokenXAddress" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Pair_token0Id_fkey" FOREIGN KEY ("token0Id") REFERENCES "Token" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Pair_token1Id_fkey" FOREIGN KEY ("token1Id") REFERENCES "Token" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "OhlcData" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "network" TEXT NOT NULL,
    "ammSource" TEXT NOT NULL,
    "timeframe" TEXT NOT NULL,
    "timestamp" DATETIME NOT NULL,
    "open" DECIMAL NOT NULL,
    "high" DECIMAL NOT NULL,
    "low" DECIMAL NOT NULL,
    "close" DECIMAL NOT NULL,
    "volume" DECIMAL NOT NULL,
    "tradeCount" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "token0Address" TEXT NOT NULL,
    "token1Address" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "GroupConfiguration" (
    "chatId" BIGINT NOT NULL PRIMARY KEY,
    "spikeMonitorEnabled" BOOLEAN NOT NULL DEFAULT false,
    "spikeMonitorTokenId" INTEGER,
    "spikeMonitorThreadId" TEXT,
    "spikeMonitorGifUrl" TEXT,
    "spikeMonitorTimeframe" INTEGER DEFAULT 2,
    "spikeMonitorInterval" INTEGER DEFAULT 30,
    CONSTRAINT "GroupConfiguration_spikeMonitorTokenId_fkey" FOREIGN KEY ("spikeMonitorTokenId") REFERENCES "Token" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "EventTracking_network_blockHeight_idx" ON "EventTracking"("network", "blockHeight");

-- CreateIndex
CREATE INDEX "EventTracking_network_eventType_idx" ON "EventTracking"("network", "eventType");

-- CreateIndex
CREATE INDEX "EventTracking_network_idx" ON "EventTracking"("network");

-- CreateIndex
CREATE INDEX "EventTracking_network_processed_idx" ON "EventTracking"("network", "processed");

-- CreateIndex
CREATE UNIQUE INDEX "EventTracking_network_transactionHash_sequenceNumber_eventType_key" ON "EventTracking"("network", "transactionHash", "sequenceNumber", "eventType");

-- CreateIndex
CREATE INDEX "SpikeyAmmSwap_pairId_idx" ON "SpikeyAmmSwap"("pairId");

-- CreateIndex
CREATE UNIQUE INDEX "SpikeyAmmSwap_network_transactionHash_eventIndex_key" ON "SpikeyAmmSwap"("network", "transactionHash", "eventIndex");

-- CreateIndex
CREATE INDEX "DexlynSwap_pairId_idx" ON "DexlynSwap"("pairId");

-- CreateIndex
CREATE UNIQUE INDEX "DexlynSwap_network_transactionHash_sequenceNumber_key" ON "DexlynSwap"("network", "transactionHash", "sequenceNumber");

-- CreateIndex
CREATE UNIQUE INDEX "Token_wrappedAddress_key" ON "Token"("wrappedAddress");

-- CreateIndex
CREATE UNIQUE INDEX "Token_network_address_key" ON "Token"("network", "address");

-- CreateIndex
CREATE INDEX "Pair_token0Id_idx" ON "Pair"("token0Id");

-- CreateIndex
CREATE INDEX "Pair_token1Id_idx" ON "Pair"("token1Id");

-- CreateIndex
CREATE UNIQUE INDEX "Pair_network_token0Id_token1Id_key" ON "Pair"("network", "token0Id", "token1Id");

-- CreateIndex
CREATE UNIQUE INDEX "Pair_network_spikeyAmmPairAddress_key" ON "Pair"("network", "spikeyAmmPairAddress");

-- CreateIndex
CREATE INDEX "OhlcData_token0Address_idx" ON "OhlcData"("token0Address");

-- CreateIndex
CREATE INDEX "OhlcData_token1Address_idx" ON "OhlcData"("token1Address");

-- CreateIndex
CREATE INDEX "OhlcData_timestamp_idx" ON "OhlcData"("timestamp");

-- CreateIndex
CREATE UNIQUE INDEX "OhlcData_network_ammSource_token0Address_token1Address_timeframe_timestamp_key" ON "OhlcData"("network", "ammSource", "token0Address", "token1Address", "timeframe", "timestamp");
