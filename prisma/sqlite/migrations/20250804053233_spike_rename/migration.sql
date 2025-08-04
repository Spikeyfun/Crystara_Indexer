/*
  Warnings:

  - You are about to drop the `SpikeSwap` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the column `spikePairAddress` on the `Pair` table. All the data in the column will be lost.
  - You are about to drop the column `spikeReserve0` on the `Pair` table. All the data in the column will be lost.
  - You are about to drop the column `spikeReserve1` on the `Pair` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "SpikeSwap_network_transactionHash_eventIndex_key";

-- DropIndex
DROP INDEX "SpikeSwap_pairId_idx";

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "SpikeSwap";
PRAGMA foreign_keys=on;

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

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Pair" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "network" TEXT NOT NULL,
    "token0Id" INTEGER NOT NULL,
    "token1Id" INTEGER NOT NULL,
    "spikeyAmmPairAddress" TEXT,
    "spikeyAmmReserve0" BIGINT,
    "spikeyAmmReserve1" BIGINT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Pair_token0Id_fkey" FOREIGN KEY ("token0Id") REFERENCES "Token" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Pair_token1Id_fkey" FOREIGN KEY ("token1Id") REFERENCES "Token" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Pair" ("createdAt", "id", "network", "token0Id", "token1Id") SELECT "createdAt", "id", "network", "token0Id", "token1Id" FROM "Pair";
DROP TABLE "Pair";
ALTER TABLE "new_Pair" RENAME TO "Pair";
CREATE INDEX "Pair_token0Id_idx" ON "Pair"("token0Id");
CREATE INDEX "Pair_token1Id_idx" ON "Pair"("token1Id");
CREATE UNIQUE INDEX "Pair_network_token0Id_token1Id_key" ON "Pair"("network", "token0Id", "token1Id");
CREATE UNIQUE INDEX "Pair_network_spikeyAmmPairAddress_key" ON "Pair"("network", "spikeyAmmPairAddress");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE INDEX "SpikeyAmmSwap_pairId_idx" ON "SpikeyAmmSwap"("pairId");

-- CreateIndex
CREATE UNIQUE INDEX "SpikeyAmmSwap_network_transactionHash_eventIndex_key" ON "SpikeyAmmSwap"("network", "transactionHash", "eventIndex");
