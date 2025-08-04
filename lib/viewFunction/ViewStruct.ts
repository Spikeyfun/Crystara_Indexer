// Constantes de configuración (similar a useView.ts)
import { createLogger } from '@/app/indexer/utils';

const logger = createLogger('fetchResource');

const SUPRA_RPC_URL_TESTNET = process.env.NEXT_PUBLIC_SUPRA_RPC_URL_TESTNET || '';
const SUPRA_RPC_URL_MAINNET = process.env.NEXT_PUBLIC_SUPRA_RPC_URL_MAINNET || '';

const RPC_URLS: Record<string, string> = {
  'supra-testnet': SUPRA_RPC_URL_TESTNET,
  'supra-mainnet': SUPRA_RPC_URL_MAINNET,
};

export async function fetchCoinInfoResource(
  network: string,
  typeTag: string // e.g., "0x1::coin::CoinInfo<0x1::aptos_coin::AptosCoin>"
): Promise<any> {
  const rpcUrl = RPC_URLS[network];
  if (!rpcUrl) {
    throw new Error(`Unsupported network: ${network}. No RPC URL configured.`);
  }

  const match = typeTag.match(/^(0x[a-fA-F0-9]+)::/);
  if (!match) {
    throw new Error("Invalid type tag format: Could not extract address.");
  }
  const address = match[1];

  // Construct the URL for fetching the resource
  const resourcePath = `0x1::coin::CoinInfo<${typeTag}>`; // This is the full resource type string
  const url = `${rpcUrl}/accounts/${address}/resources/${encodeURIComponent(resourcePath)}`;

  logger.debug(`Fetching resource from: ${url}`);

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      let errorData;
      try {
        errorData = await response.json();
      } catch (e) {
        errorData = await response.text();
      }
      logger.error(`❌ Error fetching resource from Supra API (${response.status}) for ${typeTag} on ${network}:`, errorData);
      throw new Error(`Supra API resource fetch failed with status ${response.status} for ${typeTag} on ${network}. Details: ${JSON.stringify(errorData)}`);
    }

    const data = await response.json();
    logger.debug("Successfully fetched resource data:", data);
    return data;

  } catch (error: any) {
    logger.error(`❌ Error calling resource fetch for ${typeTag} on ${network}:`, error);
    throw error;
  }
}