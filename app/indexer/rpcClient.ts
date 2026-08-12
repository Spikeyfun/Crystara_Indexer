import 'dotenv/config'
import { createLogger } from './utils'
import { RpcEvent } from './types';

const logger = createLogger('rpcClient')

export const SUPRA_RPC_URL_TESTNET = process.env.NEXT_PUBLIC_SUPRA_RPC_URL_TESTNET!
export const SUPRA_RPC_URL_MAINNET = process.env.NEXT_PUBLIC_SUPRA_RPC_URL_MAINNET!
export const CHAIN_ID_SUPRA_TESTNET = process.env.NEXT_PUBLIC_SUPRA_TESTNET ?? 'supra-testnet';
export const CHAIN_ID_SUPRA_MAINNET = process.env.NEXT_PUBLIC_SUPRA_MAINNET ?? 'supra-mainnet';

const SPIKE_AMM_ADDRESS = process.env.NEXT_PUBLIC_SUPRA_AMM_SPIKE_ADDRESS!
const SPIKE_AMM_MODULE = process.env.NEXT_PUBLIC_SUPRA_AMM_SPIKE_PAIR_MODULE!
const DEXLYN_AMM_ADDRESS = process.env.NEXT_PUBLIC_AMM_DEXLYN_ADDRESS!
const DEXLYN_AMM_MODULE = process.env.NEXT_PUBLIC_AMM_DEXLYN_PAIR_MODULE!
const NEXT_PUBLIC_DAO_CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_DAO_CONTRACT_ADDRESS || "0x89f01d4584ce004510de6dc7ad8f3c5de5ec80c96d3c4ba5d71bdfe900899070";

const MAX_RETRIES = 3
const MAX_BLOCK_RANGE = 100 // V3 is very efficient, we can safely fetch 100 blocks
const CONCURRENCY_LIMIT = 5;
const RETRY_DELAY = 2000;

export async function fetchLatestBlockHeight(rpcUrl: string): Promise<number> {
  try {
    // Priority: Use V1 height for real-time tip (Consensus scale).
    const v1Url = rpcUrl.includes('/v1') ? rpcUrl : rpcUrl.replace(/\/rpc\/v3$/, '/rpc/v1');
    const apiUrl = `${v1Url}/block`;
    
    const response = await fetch(apiUrl)
    if (!response.ok) {
      if (response.status === 429) {
        logger.warn(`Rate limit exceeded while fetching latest block height from ${apiUrl}.`);
      }
      throw new Error(`HTTP error! status: ${response.status} from ${apiUrl}`);
    }
    const data = await response.json()
    const height = data?.header?.height || data?.height || 0;
    
    return Number(height);
  } catch (error) {
    logger.error(`Error fetching latest block height from ${rpcUrl}:`, error)
    throw error
  }
}

export const EVENT_TYPES_TO_FETCH = [
  // AMM Events
  `${SPIKE_AMM_ADDRESS}::${SPIKE_AMM_MODULE}::SwapEvent`,
  `${SPIKE_AMM_ADDRESS}::${SPIKE_AMM_MODULE}::SyncEvent`,
  `${DEXLYN_AMM_ADDRESS}::${DEXLYN_AMM_MODULE}::SwapEvent`,
  
  // DAO Events
  `${NEXT_PUBLIC_DAO_CONTRACT_ADDRESS}::petra::DaoCreated`,
  `${NEXT_PUBLIC_DAO_CONTRACT_ADDRESS}::jubilee::EpochAdvanced`,
  `${NEXT_PUBLIC_DAO_CONTRACT_ADDRESS}::zeal::GaugeCreated`,
  `${NEXT_PUBLIC_DAO_CONTRACT_ADDRESS}::restore::BribeDeposited`,
  `${NEXT_PUBLIC_DAO_CONTRACT_ADDRESS}::legacy::LockCreated`,
  `${NEXT_PUBLIC_DAO_CONTRACT_ADDRESS}::legacy::LockExtended`,
  `${NEXT_PUBLIC_DAO_CONTRACT_ADDRESS}::legacy::AmountIncreased`,
  `${NEXT_PUBLIC_DAO_CONTRACT_ADDRESS}::legacy::LockMerged`,
  `${NEXT_PUBLIC_DAO_CONTRACT_ADDRESS}::legacy::Withdrawn`,
  `${NEXT_PUBLIC_DAO_CONTRACT_ADDRESS}::witness::VoteCast`,
  `${NEXT_PUBLIC_DAO_CONTRACT_ADDRESS}::herald::ProposalCreated`,
  `${NEXT_PUBLIC_DAO_CONTRACT_ADDRESS}::anchor::ProposalQueued`,
  `${NEXT_PUBLIC_DAO_CONTRACT_ADDRESS}::anchor::ProposalExecuted`,
  `${NEXT_PUBLIC_DAO_CONTRACT_ADDRESS}::anchor::ProposalCanceled`,
  `${NEXT_PUBLIC_DAO_CONTRACT_ADDRESS}::charter::DaoConfigUpdated`,
  `${NEXT_PUBLIC_DAO_CONTRACT_ADDRESS}::charter::GuardianUpdated`,
  `${NEXT_PUBLIC_DAO_CONTRACT_ADDRESS}::zeal::Voted`,
  `${NEXT_PUBLIC_DAO_CONTRACT_ADDRESS}::restore::BribeClaimed`,
  `${NEXT_PUBLIC_DAO_CONTRACT_ADDRESS}::harvest::RewardsClaimed`,
  `${NEXT_PUBLIC_DAO_CONTRACT_ADDRESS}::sentinel::ProtocolPaused`,
  `${NEXT_PUBLIC_DAO_CONTRACT_ADDRESS}::sentinel::ProtocolUnpaused`,
];

export async function fetchBlockEvents(
  rpcUrl: string,
  network: string,
  startBlock: number,
  endBlock: number
): Promise<RpcEvent[]> {
  if (endBlock - startBlock > MAX_BLOCK_RANGE) {
    logger.warn(`Requested block range ${startBlock}-${endBlock} exceeds MAX_BLOCK_RANGE ${MAX_BLOCK_RANGE}. Clamping.`)
    endBlock = startBlock + MAX_BLOCK_RANGE
  }

  // Ensure we are using V3 URL for fetching events
  const v3Url = rpcUrl.includes('/v3') ? rpcUrl : rpcUrl.replace(/\/rpc\/v1$/, '/rpc/v3');

  return await fetchEventsByTypesV3(v3Url, network, EVENT_TYPES_TO_FETCH, startBlock, endBlock);
}

async function fetchEventsByTypesV3(
  rpcUrl: string,
  network: string,
  eventTypes: string[],
  startBlock: number,
  endBlock: number
): Promise<RpcEvent[]> {
  const allFetchedEvents: RpcEvent[] = [];

  const singleEventTypeFetch = async (eventType: string): Promise<RpcEvent[]> => {
    let allFetchedForType: RpcEvent[] = [];
    let nextCursor: string | null = null;
    let keepPaginating = true;

    while (keepPaginating) {
      let attempt = 0;
      let successInThisPage = false;

      while (attempt < MAX_RETRIES && !successInThisPage) {
        try {
          const encodedType = encodeURIComponent(eventType);
          const apiUrl: string = nextCursor 
            ? `${rpcUrl}/events/${encodedType}?start=${nextCursor}&limit=100`
            : `${rpcUrl}/events/${encodedType}?start_height=${startBlock}&end_height=${endBlock + 1}&limit=100`;

          const response: any = await fetch(apiUrl);

          if (response.status === 429) {
            const delay = RETRY_DELAY * Math.pow(2, attempt);
            logger.warn(`Rate limit (429) for ${eventType}. Retrying in ${delay / 1000}s...`);
            await sleep(delay);
            attempt++;
            continue;
          }

          if (!response.ok) {
            if (response.status === 404) {
               // 404 en V3 significa que el bloque aún no está indexado (retraso en el tip)
               successInThisPage = true;
               keepPaginating = false;
               break;
            }
            throw new Error(`HTTP error ${response.status} for ${eventType}`);
          }

          const xSupraCursor: string | null = response.headers.get('x-supra-cursor');
          const responseData = await response.json();

          if (!responseData || !responseData.data || !Array.isArray(responseData.data)) {
            successInThisPage = true;
            keepPaginating = false;
            break;
          }

          const validItems = responseData.data.filter((item: any) => item && item.event && item.event.data);
          let pageHasItemsBeyondEndBlock = false;

          const mappedEvents = validItems.map((item: any): RpcEvent => {
            const ev = item.event;
            let rawTs = Number(ev.data?.timestamp || 0);
            let eventTimestamp: number;
            if (rawTs > 1e15) eventTimestamp = Math.floor(rawTs / 1e6);
            else if (rawTs > 1e12) eventTimestamp = Math.floor(rawTs / 1e3);
            else if (rawTs > 0) eventTimestamp = Math.floor(rawTs);
            else eventTimestamp = 0;

            return {
              type: ev.type || eventType,
              guid: ev.guid,
              sequence_number: String(ev.sequence_number),
              timestamp: eventTimestamp,
              data: ev.data,
              network: network,
              blockHeight: item.block_height,
              transactionHash: item.transaction_hash,
              processedTransactionHash: '',
              processedSequenceNumber: ''
            };
          });

          const validMappedEvents = mappedEvents.filter((ev: RpcEvent) => {
            if (ev.blockHeight && Number(ev.blockHeight) > endBlock) {
              pageHasItemsBeyondEndBlock = true;
              return false;
            }
            return true;
          });

          allFetchedForType.push(...validMappedEvents);

          if (xSupraCursor && !pageHasItemsBeyondEndBlock) {
            nextCursor = xSupraCursor;
          } else {
            keepPaginating = false;
          }

          successInThisPage = true;

        } catch (error: any) {
          attempt++;
          const delay = RETRY_DELAY * Math.pow(2, attempt);
          if (attempt < MAX_RETRIES) {
             await sleep(delay);
          } else {
             logger.error(`Max retries reached for ${eventType}. Throwing error to abort batch.`);
             throw new Error(`Max retries reached for ${eventType}`);
          }
        }
      }
    }
    return allFetchedForType;
  };

  for (let i = 0; i < eventTypes.length; i += CONCURRENCY_LIMIT) {
    const batch = eventTypes.slice(i, i + CONCURRENCY_LIMIT);
    const promises = batch.map(eventType => singleEventTypeFetch(eventType));
    const results = await Promise.all(promises);
    results.forEach(eventList => allFetchedEvents.push(...eventList));
  }

  return allFetchedEvents;
}

async function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}