/*
  Warnings:

  - You are about to drop the column `tokenId` on the `AnchorToken` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[network,tokenAddress]` on the table `AnchorToken` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `tokenAddress` to the `AnchorToken` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."AnchorToken" DROP CONSTRAINT "AnchorToken_tokenId_fkey";

-- DropIndex
DROP INDEX "public"."AnchorToken_tokenId_key";

-- AlterTable
ALTER TABLE "public"."AnchorToken" DROP COLUMN "tokenId",
ADD COLUMN     "tokenAddress" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "AnchorToken_network_tokenAddress_key" ON "public"."AnchorToken"("network", "tokenAddress");

-- AddForeignKey
ALTER TABLE "public"."AnchorToken" ADD CONSTRAINT "AnchorToken_network_tokenAddress_fkey" FOREIGN KEY ("network", "tokenAddress") REFERENCES "public"."Token"("network", "address") ON DELETE RESTRICT ON UPDATE CASCADE;
