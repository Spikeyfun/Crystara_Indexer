const { execFileSync } = require("child_process");
const crypto = require("crypto");

const wallet = (process.env.WALLET || "").toLowerCase();
const token = (process.env.TOKEN || "").trim();
const mode = (process.env.MODE || "coin").toLowerCase();
let decimals = Number(process.env.DECIMALS || 8);
const pageSize = Number(process.env.PAGE_SIZE || 100);
const maxPages = Number(process.env.MAX_PAGES || 2000);
const zeroThreshold = BigInt(process.env.ZERO_THRESHOLD_RAW || "0");
const rpc = process.env.SUPRA_RPC || "https://rpc-mainnet.supra.com/rpc/v3";
const gql = process.env.SUPRASCAN_GQL || "https://suprascan.io/api/graphql";

if (!wallet || !token) {
  throw Error("Missing WALLET or TOKEN env var");
}

if (!["coin", "fa"].includes(mode)) {
  throw Error("MODE must be coin or fa");
}

const sleep = (ms) => Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, ms);

function curl(url, args = []) {
  return execFileSync(
    "curl",
    [
      "-sS",
      "--retry",
      "5",
      "--retry-all-errors",
      "--retry-delay",
      "2",
      "--connect-timeout",
      "10",
      "--max-time",
      "120",
      ...args,
      url,
    ],
    { encoding: "utf8", maxBuffer: 128 * 1024 * 1024 },
  );
}

function jsonRequest(label, url, args = []) {
  let last = "";
  for (let attempt = 1; attempt <= 8; attempt++) {
    try {
      const raw = curl(url, args);
      last = raw.trim().slice(0, 300);
      if (!["{", "["].includes(raw.trim()[0])) throw Error(last || "empty response");
      return JSON.parse(raw);
    } catch (error) {
      if (attempt === 8) {
        throw Error(`${label} failed after 8 tries: ${error.message}. Last response: ${last}`);
      }
      const waitMs = 1500 * attempt;
      console.error(`${label} failed ${attempt}/8: ${error.message}`);
      console.error(`retry in ${waitMs}ms`);
      sleep(waitMs);
    }
  }
}

function post(query, variables, label) {
  return jsonRequest(label, gql, [
    "-H",
    "content-type: application/json",
    "--data-raw",
    JSON.stringify({ query, variables }),
  ]);
}

const b32 = (hex) => Buffer.from(hex.replace(/^0x/, "").padStart(64, "0"), "hex");

function normalizeAddress(value) {
  if (!value) return "";
  return "0x" + value.replace(/^0x/i, "").toLowerCase().padStart(64, "0");
}

function normalizeType(value) {
  return (value || "").replace(/0x[0-9a-fA-F]+/g, (address) => normalizeAddress(address)).toLowerCase();
}

const walletNorm = normalizeAddress(wallet);
const tokenNorm = normalizeType(token);

function primaryStoreOf(account, metadata) {
  const data = Buffer.alloc(65);
  b32(account).copy(data, 0);
  b32(metadata).copy(data, 32);
  data[64] = 0xfc;
  return "0x" + crypto.createHash("sha3-256").update(data).digest("hex");
}

const primaryStore = mode === "fa" ? primaryStoreOf(walletNorm, token) : null;
const primaryStoreNorm = primaryStore ? normalizeAddress(primaryStore) : null;

function formatAmount(value) {
  let n = BigInt(value);
  const negative = n < 0n;
  if (negative) n = -n;
  const s = n.toString().padStart(decimals + 1, "0");
  let out = `${s.slice(0, -decimals)}.${s.slice(-decimals).replace(/0+$/, "")}`;
  if (out.endsWith(".")) out = out.slice(0, -1);
  return negative ? `-${out}` : out;
}

function decimalAmountToRaw(amount, decimalPlaces) {
  const text = String(amount || "0").replace(/,/g, "").trim();
  const negative = text.startsWith("-");
  const unsigned = negative ? text.slice(1) : text;
  const [whole = "0", fraction = ""] = unsigned.split(".");
  const raw = BigInt((whole || "0") + fraction.padEnd(decimalPlaces, "0").slice(0, decimalPlaces));
  return negative ? -raw : raw;
}

function readCoinBalanceFromSupraScan() {
  const query = `query GetWalletCoins($address: String, $page: Int, $offset: Int, $blockchainEnvironment: BlockchainEnvironment, $isAddressName: Boolean) {
  getWalletCoins(address: $address, page: $page, offset: $offset, blockchainEnvironment: $blockchainEnvironment, isAddressName: $isAddressName) {
    coins {
      symbol
      amount
      assetAddress
      decimals
    }
    pageNumber
    pageCount
    totalItems
    isError
    nextPage
  }
}`;

  for (let page = 1; page <= 100; page++) {
    const response = post(
      query,
      { address: wallet, page, offset: 100, blockchainEnvironment: "mainnet", isAddressName: false },
      `SupraScan wallet coins page ${page}`,
    );
    const result = response.data && response.data.getWalletCoins;
    if (!result || result.isError) return null;
    const coin = (result.coins || []).find((item) => normalizeType(item.assetAddress) === tokenNorm);
    if (coin) {
      decimals = Number(coin.decimals || decimals);
      return decimalAmountToRaw(coin.amount, decimals);
    }
    if (!result.nextPage) break;
  }
  return null;
}

function readFaBalanceFromSupraScan() {
  const query = `query GetWalletFungibleAssets($address: String, $page: Int, $offset: Int, $blockchainEnvironment: BlockchainEnvironment, $isAddressName: Boolean) {
  getWalletFungibleAssets(address: $address, page: $page, offset: $offset, blockchainEnvironment: $blockchainEnvironment, isAddressName: $isAddressName) {
    fungibleAssets {
      amount
      faAddress
      decimals
    }
    isError
    nextPage
  }
}`;

  for (let page = 1; page <= 100; page++) {
    const response = post(
      query,
      { address: wallet, page, offset: 100, blockchainEnvironment: "mainnet", isAddressName: false },
      `SupraScan wallet FA page ${page}`,
    );
    const result = response.data && response.data.getWalletFungibleAssets;
    if (!result || result.isError) return null;
    const asset = (result.fungibleAssets || []).find((item) => normalizeAddress(item.faAddress) === normalizeAddress(token));
    if (asset) {
      decimals = Number(asset.decimals || decimals);
      return decimalAmountToRaw(asset.amount, decimals);
    }
    if (!result.nextPage) break;
  }
  return null;
}

function readCoinBalance() {
  const resources = jsonRequest("RPC wallet resources", `${rpc}/accounts/${wallet}/resources`);
  const wantedType = normalizeType(`0x1::coin::CoinStore<${token}>`);
  const resource = resources.find((item) => normalizeType(item.type) === wantedType);
  return BigInt(resource?.data?.coin?.value || "0");
}

function readFaBalance() {
  const resources = jsonRequest("RPC FA store resources", `${rpc}/accounts/${primaryStore}/resources`);
  const resource = resources.find((item) => (item.type || "").toLowerCase() === "0x1::fungible_asset::fungiblestore");
  return BigInt(resource?.data?.balance || "0");
}

function cleanEvent(event) {
  if (!event) return null;
  return {
    date_utc: event.date,
    timestamp_us: event.us.toString(),
    unix_s: (event.us / 1000000n).toString(),
    tx_hash: event.hash,
    direction: event.dir,
    amount_raw: event.raw.toString(),
    amount_human: formatAmount(event.raw),
    block_height: event.block,
  };
}

let balanceSource = "env";
let currentBalance;
if (process.env.CURRENT_BALANCE_RAW) {
  currentBalance = BigInt(process.env.CURRENT_BALANCE_RAW);
} else {
  balanceSource = "suprascan_indexer";
  currentBalance = mode === "fa" ? readFaBalanceFromSupraScan() : readCoinBalanceFromSupraScan();
  if (currentBalance === null) {
    balanceSource = "rpc_resources";
    currentBalance = mode === "fa" ? readFaBalance() : readCoinBalance();
  }
}

if (currentBalance <= zeroThreshold) {
  console.log(
    JSON.stringify(
      {
        wallet,
        token,
        mode,
        primary_store: primaryStore,
        currently_holding: false,
        current_balance_raw: currentBalance.toString(),
        current_balance_human: formatAmount(currentBalance),
        zero_threshold_raw: zeroThreshold.toString(),
        zero_threshold_human: formatAmount(zeroThreshold),
        balance_source: balanceSource,
        current_holding_since: null,
        stopped_reason: "current_balance_is_at_or_below_threshold",
      },
      null,
      2,
    ),
  );
  process.exit(0);
}

const query =
  mode === "fa"
    ? `query T($faAddress:String,$page:Int,$offset:Int,$blockchainEnvironment:BlockchainEnvironment){
  getAllTransactions(faAddress:$faAddress,page:$page,offset:$offset,blockchainEnvironment:$blockchainEnvironment){
    transactions{
      transactionBasicInfo{
        transactionHash
        confirmationTime
        senders{walletAddress}
        receivers{walletAddress}
      }
    }
    nextPage isError
  }
}`
    : `query T($coinAddress:String,$page:Int,$offset:Int,$blockchainEnvironment:BlockchainEnvironment){
  getAllTransactions(coinAddress:$coinAddress,page:$page,offset:$offset,blockchainEnvironment:$blockchainEnvironment){
    transactions{
      transactionBasicInfo{
        transactionHash
        confirmationTime
        senders{walletAddress}
        receivers{walletAddress}
      }
    }
    nextPage isError
  }
}`;

let page = 1;
let txScanned = 0;
let candidateTxsFetched = 0;
let matchingEvents = 0;
let reverseBalance = currentBalance;
let currentHoldingSince = null;
let scanComplete = false;
let lastMatchingEvent = null;

for (;;) {
  const variables =
    mode === "fa"
      ? { faAddress: token, page, offset: pageSize, blockchainEnvironment: "mainnet" }
      : { coinAddress: token, page, offset: pageSize, blockchainEnvironment: "mainnet" };

  const response = post(query, variables, `SupraScan token page ${page}`);
  const result = response.data && response.data.getAllTransactions;
  if (!result) throw Error(`Bad GraphQL response on page ${page}`);
  if (result.isError) throw Error(`SupraScan GraphQL isError on page ${page}`);

  const candidates = result.transactions.filter((item) => {
    const info = item.transactionBasicInfo || {};
    return [...(info.senders || []), ...(info.receivers || [])].some((entry) => {
      return normalizeAddress(entry.walletAddress) === walletNorm;
    });
  });

  txScanned += result.transactions.length;
  console.error(
    `token page ${page} - ${result.transactions.length} tx - ${candidates.length} wallet candidates - reverse balance ${reverseBalance.toString()}`,
  );

  for (const item of candidates) {
    const hash = item.transactionBasicInfo.transactionHash;
    candidateTxsFetched++;
    const tx = jsonRequest(`RPC tx ${hash}`, `${rpc}/transactions/${hash}`);
    const timestamp = tx.block_header && tx.block_header.timestamp;
    const events = (tx.output && tx.output.Move && tx.output.Move.events) || [];
    if (!timestamp) continue;

    const relevant = [];
    for (const event of events) {
      const data = event.data || {};
      const type = event.type;
      if (
        mode === "fa" &&
        ["0x1::fungible_asset::Deposit", "0x1::fungible_asset::Withdraw"].includes(type) &&
        normalizeAddress(data.store) === primaryStoreNorm
      ) {
        relevant.push({
          us: BigInt(timestamp.microseconds_since_unix_epoch),
          date: timestamp.utc_date_time,
          hash,
          dir: type.endsWith("Deposit") ? "IN" : "OUT",
          raw: BigInt(data.amount),
          block: tx.block_header.height,
        });
      }

      if (
        mode === "coin" &&
        ["0x1::coin::CoinDeposit", "0x1::coin::CoinWithdraw"].includes(type) &&
        normalizeAddress(data.account) === walletNorm &&
        normalizeType(data.coin_type) === tokenNorm
      ) {
        relevant.push({
          us: BigInt(timestamp.microseconds_since_unix_epoch),
          date: timestamp.utc_date_time,
          hash,
          dir: type.endsWith("Deposit") ? "IN" : "OUT",
          raw: BigInt(data.amount),
          block: tx.block_header.height,
        });
      }
    }

    for (let index = relevant.length - 1; index >= 0; index--) {
      const event = relevant[index];
      matchingEvents++;
      lastMatchingEvent = event;
      const after = reverseBalance;
      reverseBalance = event.dir === "IN" ? reverseBalance - event.raw : reverseBalance + event.raw;
      if (event.dir === "IN" && after > zeroThreshold && reverseBalance <= zeroThreshold) {
        currentHoldingSince = event;
        break;
      }
    }

    if (currentHoldingSince) break;
  }

  if (currentHoldingSince) break;
  if (!result.nextPage || result.transactions.length === 0) {
    scanComplete = true;
    break;
  }
  if (page >= maxPages) break;
  page++;
  sleep(300);
}

console.log(
  JSON.stringify(
    {
      wallet,
      token,
      mode,
      primary_store: primaryStore,
      currently_holding: true,
      current_balance_raw: currentBalance.toString(),
      current_balance_human: formatAmount(currentBalance),
      zero_threshold_raw: zeroThreshold.toString(),
      zero_threshold_human: formatAmount(zeroThreshold),
      balance_source: balanceSource,
      current_holding_since: cleanEvent(currentHoldingSince),
      last_matching_event_seen_while_scanning_back: cleanEvent(lastMatchingEvent),
      scan_complete: scanComplete,
      pages_scanned: page,
      page_size: pageSize,
      token_txs_scanned: txScanned,
      candidate_txs_fetched: candidateTxsFetched,
      matching_events_seen: matchingEvents,
      reverse_balance_after_scan_raw: reverseBalance.toString(),
      reverse_balance_after_scan_human: formatAmount(reverseBalance),
      stopped_reason: currentHoldingSince
        ? "found_current_holding_start"
        : scanComplete
          ? "reached_oldest_token_page_without_crossing_zero"
          : "max_pages_reached_without_crossing_zero",
    },
    null,
    2,
  ),
);
