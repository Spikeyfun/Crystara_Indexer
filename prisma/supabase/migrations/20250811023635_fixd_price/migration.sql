-- CreateIndex
CREATE INDEX "OhlcData_network_token0Address_token1Address_timeframe_time_idx" ON "public"."OhlcData"("network", "token0Address", "token1Address", "timeframe", "timestamp" DESC);
