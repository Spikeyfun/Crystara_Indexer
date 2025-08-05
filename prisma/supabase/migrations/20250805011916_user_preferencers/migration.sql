-- CreateTable
CREATE TABLE "public"."UserPreference" (
    "id" SERIAL NOT NULL,
    "userId" BIGINT NOT NULL,
    "defaultTokenAddress" TEXT,
    "defaultTimeframe" TEXT,

    CONSTRAINT "UserPreference_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserPreference_userId_key" ON "public"."UserPreference"("userId");
