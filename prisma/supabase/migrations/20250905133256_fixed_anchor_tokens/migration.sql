-- CreateTable
CREATE TABLE "public"."AnchorToken" (
    "id" SERIAL NOT NULL,
    "network" TEXT NOT NULL,
    "priority" INTEGER NOT NULL,
    "category" TEXT NOT NULL,
    "tokenId" INTEGER NOT NULL,

    CONSTRAINT "AnchorToken_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AnchorToken_tokenId_key" ON "public"."AnchorToken"("tokenId");

-- CreateIndex
CREATE INDEX "AnchorToken_network_priority_idx" ON "public"."AnchorToken"("network", "priority");

-- AddForeignKey
ALTER TABLE "public"."AnchorToken" ADD CONSTRAINT "AnchorToken_tokenId_fkey" FOREIGN KEY ("tokenId") REFERENCES "public"."Token"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
