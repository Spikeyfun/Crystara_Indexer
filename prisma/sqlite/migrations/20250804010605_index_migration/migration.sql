/*
  Warnings:

  - You are about to drop the column `eventIndex` on the `DexlynSwap` table. All the data in the column will be lost.
  - Added the required column `sequenceNumber` to the `DexlynSwap` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_DexlynSwap" (
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
INSERT INTO "new_DexlynSwap" ("blockNumber", "blockTimestamp", "curve", "id", "network", "pairId", "processedAt", "reserveX", "reserveY", "timestamp", "transactionHash", "xIn", "xOut", "yIn", "yOut") SELECT "blockNumber", "blockTimestamp", "curve", "id", "network", "pairId", "processedAt", "reserveX", "reserveY", "timestamp", "transactionHash", "xIn", "xOut", "yIn", "yOut" FROM "DexlynSwap";
DROP TABLE "DexlynSwap";
ALTER TABLE "new_DexlynSwap" RENAME TO "DexlynSwap";
CREATE INDEX "DexlynSwap_pairId_idx" ON "DexlynSwap"("pairId");
CREATE UNIQUE INDEX "DexlynSwap_network_transactionHash_sequenceNumber_key" ON "DexlynSwap"("network", "transactionHash", "sequenceNumber");
CREATE TABLE "new_EventTracking" (
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
INSERT INTO "new_EventTracking" ("blockHeight", "createdAt", "error", "eventType", "id", "network", "processed", "sequenceNumber", "transactionHash", "updatedAt") SELECT "blockHeight", "createdAt", "error", "eventType", "id", "network", "processed", "sequenceNumber", "transactionHash", "updatedAt" FROM "EventTracking";
DROP TABLE "EventTracking";
ALTER TABLE "new_EventTracking" RENAME TO "EventTracking";
CREATE INDEX "EventTracking_network_blockHeight_idx" ON "EventTracking"("network", "blockHeight");
CREATE INDEX "EventTracking_network_eventType_idx" ON "EventTracking"("network", "eventType");
CREATE INDEX "EventTracking_network_idx" ON "EventTracking"("network");
CREATE INDEX "EventTracking_network_processed_idx" ON "EventTracking"("network", "processed");
CREATE UNIQUE INDEX "EventTracking_network_transactionHash_sequenceNumber_eventType_key" ON "EventTracking"("network", "transactionHash", "sequenceNumber", "eventType");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
