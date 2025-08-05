/*
  Warnings:

  - You are about to drop the column `spikePairAddress` on the `Pair` table. All the data in the column will be lost.
  - You are about to drop the column `token0Address` on the `Pair` table. All the data in the column will be lost.
  - You are about to drop the column `token0Symbol` on the `Pair` table. All the data in the column will be lost.
  - You are about to drop the column `token1Address` on the `Pair` table. All the data in the column will be lost.
  - You are about to drop the column `token1Symbol` on the `Pair` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[network,token0Id,token1Id]` on the table `Pair` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[network,spikeyAmmPairAddress]` on the table `Pair` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `token0Id` to the `Pair` table without a default value. This is not possible if the table is not empty.
  - Added the required column `token1Id` to the `Pair` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "public"."Pair_network_spikePairAddress_key";

-- DropIndex
DROP INDEX "public"."Pair_network_token0Address_token1Address_key";

-- AlterTable
ALTER TABLE "public"."Pair" DROP COLUMN "spikePairAddress",
DROP COLUMN "token0Address",
DROP COLUMN "token0Symbol",
DROP COLUMN "token1Address",
DROP COLUMN "token1Symbol",
ADD COLUMN     "lastStatsUpdate" TIMESTAMP(3),
ADD COLUMN     "spikeyAmmPairAddress" TEXT,
ADD COLUMN     "spikeyAmmReserve0" BIGINT,
ADD COLUMN     "spikeyAmmReserve1" BIGINT,
ADD COLUMN     "token0Id" INTEGER NOT NULL,
ADD COLUMN     "token1Id" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "public"."Token" (
    "id" SERIAL NOT NULL,
    "network" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "wrappedAddress" TEXT,
    "symbol" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "decimals" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Token_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Token_wrappedAddress_key" ON "public"."Token"("wrappedAddress");

-- CreateIndex
CREATE UNIQUE INDEX "Token_network_address_key" ON "public"."Token"("network", "address");

-- CreateIndex
CREATE INDEX "Pair_token0Id_idx" ON "public"."Pair"("token0Id");

-- CreateIndex
CREATE INDEX "Pair_token1Id_idx" ON "public"."Pair"("token1Id");

-- CreateIndex
CREATE UNIQUE INDEX "Pair_network_token0Id_token1Id_key" ON "public"."Pair"("network", "token0Id", "token1Id");

-- CreateIndex
CREATE UNIQUE INDEX "Pair_network_spikeyAmmPairAddress_key" ON "public"."Pair"("network", "spikeyAmmPairAddress");

-- AddForeignKey
ALTER TABLE "public"."Pair" ADD CONSTRAINT "Pair_token0Id_fkey" FOREIGN KEY ("token0Id") REFERENCES "public"."Token"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Pair" ADD CONSTRAINT "Pair_token1Id_fkey" FOREIGN KEY ("token1Id") REFERENCES "public"."Token"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
