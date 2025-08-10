/*
  Warnings:

  - You are about to drop the column `pairId` on the `OhlcData` table. All the data in the column will be lost.
  - Added the required column `token0Address` to the `OhlcData` table without a default value. This is not possible if the table is not empty.
  - Added the required column `token1Address` to the `OhlcData` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_OhlcData" (
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
INSERT INTO "new_OhlcData" ("ammSource", "close", "createdAt", "high", "id", "low", "network", "open", "timeframe", "timestamp", "tradeCount", "updatedAt", "volume") SELECT "ammSource", "close", "createdAt", "high", "id", "low", "network", "open", "timeframe", "timestamp", "tradeCount", "updatedAt", "volume" FROM "OhlcData";
DROP TABLE "OhlcData";
ALTER TABLE "new_OhlcData" RENAME TO "OhlcData";
CREATE INDEX "OhlcData_token0Address_idx" ON "OhlcData"("token0Address");
CREATE INDEX "OhlcData_token1Address_idx" ON "OhlcData"("token1Address");
CREATE INDEX "OhlcData_timestamp_idx" ON "OhlcData"("timestamp");
CREATE UNIQUE INDEX "OhlcData_network_ammSource_token0Address_token1Address_timeframe_timestamp_key" ON "OhlcData"("network", "ammSource", "token0Address", "token1Address", "timeframe", "timestamp");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
