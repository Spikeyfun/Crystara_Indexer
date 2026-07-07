import { fetchBlockEvents, SUPRA_RPC_URL_TESTNET, CHAIN_ID_SUPRA_TESTNET } from './app/indexer/rpcClient';
import { createLogger } from './app/indexer/utils';

const logger = createLogger('rpc-test');

async function runTest() {
  const startBlock = 108281350; // Un bloque cercano al que está procesando
  const endBlock = startBlock + 100 - 1; // Un lote de 100 bloques
  
  logger.info(`Testing RPC fetch for 100 blocks (${startBlock} to ${endBlock})...`);
  
  const startTime = Date.now();
  try {
    const events = await fetchBlockEvents(
      SUPRA_RPC_URL_TESTNET,
      CHAIN_ID_SUPRA_TESTNET,
      startBlock,
      endBlock
    );
    const endTime = Date.now();
    logger.info(`SUCCESS: Fetched ${events.length} events in ${endTime - startTime}ms.`);
  } catch (error) {
    logger.error('FAILED: Error during test:', error);
  }
  
  process.exit(0);
}

runTest();
