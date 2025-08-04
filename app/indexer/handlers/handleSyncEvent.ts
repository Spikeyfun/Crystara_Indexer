import { RpcEvent, TransactionClient, SyncEventData } from '../types';
import { createLogger } from '../utils';

const logger = createLogger('spikeyAmmSyncHandler');

export async function handleSyncEvent(event: RpcEvent, tx: TransactionClient) {
  const syncEventData = event.data as SyncEventData;
  logger.debug(`[${event.network}] Processing SyncEvent`, syncEventData);

  // Find the Pair by its spikeyAmmPairAddress
  const pair = await tx.pair.findUnique({
    where: {
      network_spikeyAmmPairAddress: {
        network: event.network,
        spikeyAmmPairAddress: syncEventData.pair_address,
      },
    },
  });

  if (pair) {
    logger.info(`[${event.network}] Updating reserves for Pair ${pair.id} (${syncEventData.pair_address}).`);
    await tx.pair.update({
      where: {
        id: pair.id,
      },
      data: {
        spikeyAmmReserve0: BigInt(syncEventData.reserve0),
        spikeyAmmReserve1: BigInt(syncEventData.reserve1),
      },
    });
    logger.info(`[${event.network}] Successfully updated reserves for Pair ${pair.id}.`);
  } else {
    logger.warn(`[${event.network}] Pair with spikeyAmmPairAddress ${syncEventData.pair_address} not found for SyncEvent. Skipping update.`);
    // Optionally, you might want to create a minimal Pair entry here if it's expected
    // that a SyncEvent could arrive before a SwapEvent for a new pair.
    // For now, we'll just log a warning.
  }
}
