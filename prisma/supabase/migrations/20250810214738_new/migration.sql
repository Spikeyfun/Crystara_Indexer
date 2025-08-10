/*
  Warnings:

  - You are about to drop the column `pairId` on the `OhlcData` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[network,ammSource,token0Address,token1Address,timeframe,timestamp]` on the table `OhlcData` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `token0Address` to the `OhlcData` table without a default value. This is not possible if the table is not empty.
  - Added the required column `token1Address` to the `OhlcData` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."OhlcData" DROP CONSTRAINT "OhlcData_pairId_fkey";

-- DropIndex
DROP INDEX "public"."OhlcData_network_ammSource_pairId_timeframe_timestamp_key";

-- DropIndex
DROP INDEX "public"."OhlcData_pairId_idx";

-- AlterTable
ALTER TABLE "public"."OhlcData" DROP COLUMN "pairId",
ADD COLUMN     "token0Address" TEXT NOT NULL,
ADD COLUMN     "token1Address" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "OhlcData_token0Address_idx" ON "public"."OhlcData"("token0Address");

-- CreateIndex
CREATE INDEX "OhlcData_token1Address_idx" ON "public"."OhlcData"("token1Address");

-- CreateIndex
CREATE UNIQUE INDEX "OhlcData_network_ammSource_token0Address_token1Address_time_key" ON "public"."OhlcData"("network", "ammSource", "token0Address", "token1Address", "timeframe", "timestamp");
