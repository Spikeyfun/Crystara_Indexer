import { sqliteDb } from '../lib/prismadb';
import { handleSpikeyAmmSwapEvent } from '../app/indexer/handlers/handleSpikeSwapEvent';
import { createLogger } from '../app/indexer/utils';
import { RpcEvent } from '../app/indexer/types';

const logger = createLogger('replay-spike-events');

async function replayEvents() {
  logger.info('Starting event replay...');

  const eventToReplay: RpcEvent = {
    network: 'supra-mainnet',
    processedTransactionHash: 'unknown_tx_for_0x3045d27b5fada1e30897a741fb184e48ef0bff3717aea23918ebc1e5c7153083::amm_pair::SwapEvent_block_20274683',
    sequence_number: '0',
    data: {
      pair_address: '0x7117dce3b042245f8b4f1a4e35cd0f63ff10200c4e8b9e67dbb9c6ab82626321',
      sender: '0x55261ac15d692b8834110a9e3cc9fe1077ae9ba2ec93da2ba8888adfa461f2df',
      to: '0x55261ac15d692b8834110a9e3cc9fe1077ae9ba2ec93da2ba8888adfa461f2df',
      amount0_in: '400000000000',
      amount1_in: '0',
      amount0_out: '0',
      amount1_out: '45489796679580',
    },
    blockHeight: '20274683',
    timestamp: '1723862642',
  };

  try {
    await sqliteDb.$transaction(async (tx) => {
        // @ts-ignore
      await handleSpikeyAmmSwapEvent(eventToReplay, tx);
    });
    logger.info(`Successfully replayed event`);
  } catch (error) {
    logger.error(`Error replaying event:`, error);
  }

  logger.info('Event replay finished.');
}

replayEvents().catch((e) => {
  console.error('An unexpected error occurred during event replay:', e);
  process.exit(1);
});