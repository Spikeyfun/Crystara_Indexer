/*
  Warnings:

  - You are about to drop the `UserPreference` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "public"."UserPreference";

-- CreateTable
CREATE TABLE "public"."GroupConfiguration" (
    "chatId" BIGINT NOT NULL,
    "spikeMonitorEnabled" BOOLEAN NOT NULL DEFAULT false,
    "spikeMonitorTokenId" INTEGER,
    "spikeMonitorThreadId" TEXT,
    "spikeMonitorGifUrl" TEXT,
    "spikeMonitorTimeframe" INTEGER DEFAULT 2,
    "spikeMonitorInterval" INTEGER DEFAULT 30,

    CONSTRAINT "GroupConfiguration_pkey" PRIMARY KEY ("chatId")
);

-- AddForeignKey
ALTER TABLE "public"."GroupConfiguration" ADD CONSTRAINT "GroupConfiguration_spikeMonitorTokenId_fkey" FOREIGN KEY ("spikeMonitorTokenId") REFERENCES "public"."Token"("id") ON DELETE SET NULL ON UPDATE CASCADE;
