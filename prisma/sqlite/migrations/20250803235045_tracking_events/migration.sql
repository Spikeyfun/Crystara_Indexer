/*
  Warnings:

  - A unique constraint covering the columns `[network,transactionHash,sequenceNumber,eventType]` on the table `EventTracking` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "EventTracking" ADD COLUMN "sequenceNumber" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "EventTracking_network_transactionHash_sequenceNumber_eventType_key" ON "EventTracking"("network", "transactionHash", "sequenceNumber", "eventType");
