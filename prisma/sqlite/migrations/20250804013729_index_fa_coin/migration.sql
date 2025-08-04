/*
  Warnings:

  - You are about to drop the column `token0Address` on the `Pair` table. All the data in the column will be lost.
  - You are about to drop the column `token0Symbol` on the `Pair` table. All the data in the column will be lost.
  - You are about to drop the column `token1Address` on the `Pair` table. All the data in the column will be lost.
  - You are about to drop the column `token1Symbol` on the `Pair` table. All the data in the column will be lost.
  - Added the required column `token0Id` to the `Pair` table without a default value. This is not possible if the table is not empty.
  - Added the required column `token1Id` to the `Pair` table without a default value. This is not possible if the table is not empty.

*/
-- CreateTable
CREATE TABLE "Token" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "network" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "wrappedAddress" TEXT,
    "symbol" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "decimals" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Pair" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "network" TEXT NOT NULL,
    "token0Id" INTEGER NOT NULL,
    "token1Id" INTEGER NOT NULL,
    "spikePairAddress" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Pair_token0Id_fkey" FOREIGN KEY ("token0Id") REFERENCES "Token" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Pair_token1Id_fkey" FOREIGN KEY ("token1Id") REFERENCES "Token" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Pair" ("createdAt", "id", "network", "spikePairAddress") SELECT "createdAt", "id", "network", "spikePairAddress" FROM "Pair";
DROP TABLE "Pair";
ALTER TABLE "new_Pair" RENAME TO "Pair";
CREATE INDEX "Pair_token0Id_idx" ON "Pair"("token0Id");
CREATE INDEX "Pair_token1Id_idx" ON "Pair"("token1Id");
CREATE UNIQUE INDEX "Pair_network_token0Id_token1Id_key" ON "Pair"("network", "token0Id", "token1Id");
CREATE UNIQUE INDEX "Pair_network_spikePairAddress_key" ON "Pair"("network", "spikePairAddress");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "Token_wrappedAddress_key" ON "Token"("wrappedAddress");

-- CreateIndex
CREATE UNIQUE INDEX "Token_network_address_key" ON "Token"("network", "address");
