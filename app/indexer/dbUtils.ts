import { createLogger } from './utils';
import { callViewFunction } from '@/lib/viewFunction/useView';
import { TransactionClient } from './types';
import { Token } from '@/generated/sqlite'; // Import the Token type from your generated Prisma client
import { fetchCoinInfoResource } from '@/lib/viewFunction/ViewStruct';

const logger = createLogger('dbUtils');

const MODULE_PATH_STAKING = `${process.env.NEXT_PUBLIC_STAKING_ADDRESS}::${process.env.NEXT_PUBLIC_STAKING_MODULE}`;
const MODULE_PATH_PAIR = `${process.env.NEXT_PUBLIC_SUPRA_AMM_SPIKE_ADDRESS}::${process.env.NEXT_PUBLIC_SUPRA_AMM_SPIKE_PAIR_MODULE}`;
const MODULE_PATH_WRAPPER = `${process.env.NEXT_PUBLIC_SUPRA_AMM_SPIKE_ADDRESS}::${process.env.NEXT_PUBLIC_SUPRA_AMM_SPIKE_WRAPPER_MODULE}`;

export async function getOrCreateToken(
  tokenAddress: string,
  network: string,
  tx: TransactionClient
): Promise<Token> {
  if (!tokenAddress) {
    logger.error(`[${network}] Attempted to get or create token with null or undefined address.`);
    throw new Error(`Token address cannot be null or undefined for network ${network}`);
  }

  let primaryTokenAddress = tokenAddress; // Assume input is primary by default
  let finalWrappedAddress: string | null = null;

  let metadataSuccess = false;
  let tokenDataFromRpc: any = null;

  // First, try to determine if the input tokenAddress is a wrapped FA and get its original Coin-Legacy address
  if (!tokenAddress.includes("::")) { // If it's a Fungible Asset
    try {
      const originalResponse = await callViewFunction(network, MODULE_PATH_WRAPPER, "get_original", [], [tokenAddress]);
      if (originalResponse && originalResponse.result && typeof originalResponse.result[0] === 'string') {
        const potentialOriginalAddress = originalResponse.result[0];
        if (potentialOriginalAddress !== tokenAddress &&
            potentialOriginalAddress !== "0x0" &&
            !potentialOriginalAddress.startsWith("0x00000000000000000000000000000000") &&
            potentialOriginalAddress.includes("::") // Check if it's a Coin-Legacy address
        ) {
          primaryTokenAddress = potentialOriginalAddress; // The original Coin-Legacy is the primary
          finalWrappedAddress = tokenAddress; // The FA is the wrapped address
          logger.info(`[${network}] Token ${tokenAddress} (FA) is a wrapper. Original Coin Type (Coin-Legacy): ${primaryTokenAddress}. Setting FA as wrappedAddress.`);
        } else {
          logger.debug(`[${network}] get_original for ${tokenAddress} (FA) returned itself or an unexpected type: ${potentialOriginalAddress}. Treating input as primary.`);
          finalWrappedAddress = tokenAddress; // Input FA is primary, no legacy wrapper found
        }
      } else {
        logger.warn(`[${network}] Unexpected response from get_original for ${tokenAddress} (FA). Treating input as primary.`, originalResponse);
        finalWrappedAddress = tokenAddress; // Input FA is primary, unexpected response
      }
    } catch (rpcError: any) {
      logger.error(`[${network}] RPC call to get_original for ${tokenAddress} (FA) failed. Error: ${rpcError.message}. Treating input as primary.`);
      finalWrappedAddress = tokenAddress; // Input FA is primary, RPC failed
    }
  } else { // If it's a Coin-Legacy, it's already the primary
    logger.debug(`[${network}] Token ${tokenAddress} is Coin-Legacy. Treating as primary.`);
  }

  // Now, fetch metadata for the determined primaryTokenAddress
  try {
    if (!primaryTokenAddress.includes("::")) { // If primary is a Fungible Asset
        const metadataResponse = await callViewFunction(network, "0x1::fungible_asset", "metadata", ["0x1::object::ObjectCore"], [primaryTokenAddress]);
        if (metadataResponse && metadataResponse.result && metadataResponse.result[0]) {
            tokenDataFromRpc = metadataResponse.result[0];
            if (typeof tokenDataFromRpc.name === 'string' &&
                typeof tokenDataFromRpc.symbol === 'string' &&
                typeof tokenDataFromRpc.decimals === 'number') {
                metadataSuccess = true;
                logger.info(`[${network}] Successfully fetched FA metadata for primary ${primaryTokenAddress}: Name=${tokenDataFromRpc.name}, Symbol=${tokenDataFromRpc.symbol}, Decimals=${tokenDataFromRpc.decimals}`);
            } else {
                logger.warn(`[${network}] FA metadata for primary ${primaryTokenAddress} has unexpected structure.`, tokenDataFromRpc);
            }
        } else {
             logger.warn(`[${network}] No FA metadata result for primary ${primaryTokenAddress}.`, metadataResponse);
        }
    } else { // If primary is a Coin-Legacy
        logger.info(`[${network}] Primary token ${primaryTokenAddress} appears to be Coin-Legacy. Attempting to fetch Coin-Legacy specific info using fetchCoinInfoResource.`);
        try {
            const coinInfoResource = await fetchCoinInfoResource(network, primaryTokenAddress);
            logger.debug(`[${network}] Raw CoinInfo resource for ${primaryTokenAddress}:`, JSON.stringify(coinInfoResource, null, 2));
            if (coinInfoResource && coinInfoResource.result && coinInfoResource.result[0]) {
                tokenDataFromRpc = coinInfoResource.result[0];
                if (typeof tokenDataFromRpc.name === 'string' &&
                    typeof tokenDataFromRpc.symbol === 'string' &&
                    typeof tokenDataFromRpc.decimals === 'number') {
                    metadataSuccess = true;
                    logger.info(`[${network}] Successfully fetched Coin-Legacy metadata for primary ${primaryTokenAddress}: Name=${tokenDataFromRpc.name}, Symbol=${tokenDataFromRpc.symbol}, Decimals=${tokenDataFromRpc.decimals}`);
                } else {
                    logger.warn(`[${network}] Coin-Legacy metadata for primary ${primaryTokenAddress} has unexpected structure.`, tokenDataFromRpc);
                }
            } else {
                logger.warn(`[${network}] No CoinInfo resource data for primary ${primaryTokenAddress}.`, coinInfoResource);
            }
        } catch (resourceError: any) {
            logger.error(`[${network}] Failed to fetch CoinInfo resource for ${primaryTokenAddress}. Error: ${resourceError.message}.`);
        }
    }
  } catch (rpcError: any) {
    logger.error(`[${network}] RPC call to fetch metadata for primary ${primaryTokenAddress} failed. Error: ${rpcError.message}.`);
  }

  // Now, try to find the token using the primaryTokenAddress
  let token = await tx.token.findUnique({
    where: { network_address: { network: network, address: primaryTokenAddress } },
  });

  const dataForDb = {
    name: metadataSuccess && tokenDataFromRpc ? (tokenDataFromRpc.name ?? `Unknown Token ${primaryTokenAddress.substring(0, 10)}`) : (token ? token.name : `Unknown Token ${primaryTokenAddress.substring(0, 10)}`),
    symbol: metadataSuccess && tokenDataFromRpc ? (tokenDataFromRpc.symbol ?? `UNK_${primaryTokenAddress.substring(0, 6)}`) : (token ? token.symbol : `UNK_${primaryTokenAddress.substring(0, 6)}`),
    decimals: metadataSuccess && tokenDataFromRpc ? (tokenDataFromRpc.decimals ?? 0) : (token ? token.decimals : 0),
    wrappedAddress: finalWrappedAddress,
  };

  if (!token) {
    logger.info(`[${network}] Creating new token entry for canonical ${primaryTokenAddress}.`);
    try {
      token = await tx.token.create({
        data: {
          network: network,
          address: primaryTokenAddress,
          ...dataForDb,
        },
      });
    } catch (e: any) {
      if (e.code === 'P2002' && e.meta?.target?.includes('network_address')) {
        logger.warn(`[${network}] Race condition: Token ${primaryTokenAddress} created concurrently. Fetching existing.`);
        token = await tx.token.findUniqueOrThrow({
          where: { network_address: { network: network, address: primaryTokenAddress } },
        });
      } else {
        logger.error(`[${network}] Error creating token ${primaryTokenAddress}:`, e);
        throw e;
      }
    }
  } else {
    // Update existing token if metadata changed or wrappedAddress needs to be set
    if (
      (metadataSuccess && (
        token.name !== dataForDb.name ||
        token.symbol !== dataForDb.symbol ||
        token.decimals !== dataForDb.decimals
      )) ||
      (finalWrappedAddress && token.wrappedAddress !== finalWrappedAddress) // Only update if finalWrappedAddress is not null and different
    ) {
      logger.info(`[${network}] Updating existing token ${primaryTokenAddress}.`);
      token = await tx.token.update({
        where: { network_address: { network: network, address: primaryTokenAddress } },
        data: dataForDb,
      });
    }
  }

  if (!token) {
    logger.error(`[${network}] CRITICAL: Token object is null for ${primaryTokenAddress} at the end of getOrCreateToken. This should not happen.`);
    throw new Error(`Failed to get or create token ${primaryTokenAddress} on network ${network}.`);
  }

  return token;
}

export async function unpackPairAddresses(
  network: string,
  pairAddress: string
): Promise<{ token0Address: string; token1Address: string }> {
  logger.debug(`[${network}] Attempting to unpack pair addresses for pair object address: ${pairAddress}.`);
  try {
    const unpackPairResponse = await callViewFunction(network, MODULE_PATH_PAIR, "unpack_pair", [], [pairAddress]);
    logger.debug(`[${network}] Raw RPC response for unpack_pair(${pairAddress}):`, JSON.stringify(unpackPairResponse, null, 2));

    if (unpackPairResponse && unpackPairResponse.result && unpackPairResponse.result.length === 2) {
      const token0Address = unpackPairResponse.result[0].inner;
      const token1Address = unpackPairResponse.result[1].inner;
      logger.info(`[${network}] Successfully unpacked pair ${pairAddress}: Token0=${token0Address}, Token1=${token1Address}`);
      return { token0Address, token1Address };
    } else {
      logger.error(`[${network}] Failed to unpack pair ${pairAddress}. Unexpected RPC response structure:`, unpackPairResponse);
      throw new Error(`Failed to unpack pair ${pairAddress}: Unexpected RPC response structure.`);
    }
  } catch (rpcError: any) {
    logger.error(`[${network}] RPC call to unpack_pair for ${pairAddress} failed. Error: ${rpcError.message}.`);
    throw rpcError; // Re-throw the error to be handled by the caller
  }
}

export function calculateScaleLogic(decimals: number): string {
    const ACCUM_REWARD_SCALE_MOVE = BigInt("1000000000000");
    let stakeScaleFactor = BigInt(1);
    for (let i = 0; i < decimals; i++) {
        stakeScaleFactor *= BigInt(10);
    }
    const scale = stakeScaleFactor * ACCUM_REWARD_SCALE_MOVE;
    return scale.toString();
}
