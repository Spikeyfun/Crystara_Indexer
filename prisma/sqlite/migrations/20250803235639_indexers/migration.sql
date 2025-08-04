/*
  Warnings:

  - Made the column `sequenceNumber` on table `EventTracking` required. This step will fail if there are existing NULL values in that column.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
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
    "sequenceNumber" TEXT NOT NULL
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
