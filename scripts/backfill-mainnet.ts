import { fetchBlockEvents } from '../app/indexer/rpcClient';
import { processEvents } from '../app/indexer/eventProcessor';

async function main() {
  const block = 54960343;
  const rpcUrl = process.env.SUPRA_RPC_URL_MAINNET || 'https://rpc-mainnet.supra.com/rpc/v1';
  console.log(`Fetching events for mainnet block ${block}...`);
  try {
    const events = await fetchBlockEvents(rpcUrl, 'supra-mainnet', block, block + 1);
    const targetEvents = events.filter((e: any) => e.blockHeight === block.toString() || e.blockHeight === block || Number(e.blockHeight) === block);
    if (targetEvents.length > 0) {
      console.log(`Found ${targetEvents.length} target events in block ${block}. Processing...`);
      await processEvents(targetEvents, null);
      console.log(`Successfully processed block ${block}.`);
    } else {
      console.log(`No configured events found in block ${block}.`);
    }
  } catch (e: any) {
    console.error(`Failed on block ${block}:`, e);
  }
  console.log('Done!');
}
main();
