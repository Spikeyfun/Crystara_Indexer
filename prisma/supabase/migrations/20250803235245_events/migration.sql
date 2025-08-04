-- CreateTable
CREATE TABLE "BlockProgress" (
    "id" SERIAL NOT NULL,
    "network" TEXT NOT NULL,
    "lastBlockHeight" BIGINT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BlockProgress_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EventTracking" (
    "id" SERIAL NOT NULL,
    "eventType" TEXT NOT NULL,
    "blockHeight" BIGINT NOT NULL,
    "transactionHash" TEXT NOT NULL,
    "processed" BOOLEAN NOT NULL DEFAULT false,
    "error" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "network" TEXT NOT NULL,
    "sequenceNumber" TEXT,

    CONSTRAINT "EventTracking_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Pair" (
    "id" SERIAL NOT NULL,
    "network" TEXT NOT NULL,
    "token0Address" TEXT NOT NULL,
    "token1Address" TEXT NOT NULL,
    "spikePairAddress" TEXT,
    "token0Symbol" TEXT,
    "token1Symbol" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Pair_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OhlcData" (
    "id" SERIAL NOT NULL,
    "network" TEXT NOT NULL,
    "ammSource" TEXT NOT NULL,
    "timeframe" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL,
    "open" DECIMAL(65,30) NOT NULL,
    "high" DECIMAL(65,30) NOT NULL,
    "low" DECIMAL(65,30) NOT NULL,
    "close" DECIMAL(65,30) NOT NULL,
    "volume" DECIMAL(65,30) NOT NULL,
    "tradeCount" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "pairId" INTEGER NOT NULL,

    CONSTRAINT "OhlcData_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "BlockProgress_network_key" ON "BlockProgress"("network");

-- CreateIndex
CREATE INDEX "EventTracking_network_blockHeight_idx" ON "EventTracking"("network", "blockHeight");

-- CreateIndex
CREATE INDEX "EventTracking_network_eventType_idx" ON "EventTracking"("network", "eventType");

-- CreateIndex
CREATE INDEX "EventTracking_network_idx" ON "EventTracking"("network");

-- CreateIndex
CREATE INDEX "EventTracking_network_processed_idx" ON "EventTracking"("network", "processed");

-- CreateIndex
CREATE UNIQUE INDEX "EventTracking_network_transactionHash_sequenceNumber_eventT_key" ON "EventTracking"("network", "transactionHash", "sequenceNumber", "eventType");

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

-- AddForeignKey
ALTER TABLE "OhlcData" ADD CONSTRAINT "OhlcData_pairId_fkey" FOREIGN KEY ("pairId") REFERENCES "Pair"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
