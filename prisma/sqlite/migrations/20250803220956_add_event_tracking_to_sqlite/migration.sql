-- CreateTable
CREATE TABLE "EventTracking" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "network" TEXT NOT NULL,
    "eventType" TEXT NOT NULL,
    "blockHeight" BIGINT NOT NULL,
    "transactionHash" TEXT NOT NULL,
    "processed" BOOLEAN NOT NULL DEFAULT false,
    "error" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE INDEX "EventTracking_network_eventType_idx" ON "EventTracking"("network", "eventType");

-- CreateIndex
CREATE INDEX "EventTracking_network_blockHeight_idx" ON "EventTracking"("network", "blockHeight");
