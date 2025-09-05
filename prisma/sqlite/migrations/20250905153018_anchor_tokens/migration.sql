-- CreateTable
CREATE TABLE "AnchorToken" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "network" TEXT NOT NULL,
    "priority" INTEGER NOT NULL,
    "category" TEXT NOT NULL,
    "tokenAddress" TEXT NOT NULL,
    CONSTRAINT "AnchorToken_network_tokenAddress_fkey" FOREIGN KEY ("network", "tokenAddress") REFERENCES "Token" ("network", "address") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "AnchorToken_network_priority_idx" ON "AnchorToken"("network", "priority");

-- CreateIndex
CREATE UNIQUE INDEX "AnchorToken_network_tokenAddress_key" ON "AnchorToken"("network", "tokenAddress");
