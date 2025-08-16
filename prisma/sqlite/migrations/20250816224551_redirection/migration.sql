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
