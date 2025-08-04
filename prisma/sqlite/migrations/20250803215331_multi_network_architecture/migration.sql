-- CreateTable
CREATE TABLE "SpikeSwap" (
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
    CONSTRAINT "SpikeSwap_pairId_fkey" FOREIGN KEY ("pairId") REFERENCES "Pair" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "DexlynSwap" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "network" TEXT NOT NULL,
    "transactionHash" TEXT NOT NULL,
    "eventIndex" INTEGER NOT NULL,
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
CREATE TABLE "Pair" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "network" TEXT NOT NULL,
    "token0Address" TEXT NOT NULL,
    "token1Address" TEXT NOT NULL,
    "spikePairAddress" TEXT,
    "token0Symbol" TEXT,
    "token1Symbol" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
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
    "pairId" INTEGER NOT NULL,
    CONSTRAINT "OhlcData_pairId_fkey" FOREIGN KEY ("pairId") REFERENCES "Pair" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "SpikeSwap_pairId_idx" ON "SpikeSwap"("pairId");

-- CreateIndex
CREATE UNIQUE INDEX "SpikeSwap_network_transactionHash_eventIndex_key" ON "SpikeSwap"("network", "transactionHash", "eventIndex");

-- CreateIndex
CREATE INDEX "DexlynSwap_pairId_idx" ON "DexlynSwap"("pairId");

-- CreateIndex
CREATE UNIQUE INDEX "DexlynSwap_network_transactionHash_eventIndex_key" ON "DexlynSwap"("network", "transactionHash", "eventIndex");

-- CreateIndex
CREATE UNIQUE INDEX "Pair_network_token0Address_token1Address_key" ON "Pair"("network", "token0Address", "token1Address");

-- CreateIndex
CREATE UNIQUE INDEX "Pair_network_spikePairAddress_key" ON "Pair"("network", "spikePairAddress");

-- CreateIndex
CREATE INDEX "OhlcData_pairId_idx" ON "OhlcData"("pairId");

-- CreateIndex
CREATE INDEX "OhlcData_timestamp_idx" ON "OhlcData"("timestamp");

-- CreateIndex
CREATE UNIQUE INDEX "OhlcData_network_ammSource_pairId_timeframe_timestamp_key" ON "OhlcData"("network", "ammSource", "pairId", "timeframe", "timestamp");
