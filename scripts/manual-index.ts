import { fetchBlockEvents } from '../app/indexer/rpcClient';
import { processEvents } from '../app/indexer/eventProcessor';

async function main() {
  const blockArg = process.argv[2] ? parseInt(process.argv[2]) : 110788697;
  const blocks = [blockArg];
  const rpcUrl = 'https://rpc-testnet.supra.com/rpc/v1';
  for (const block of blocks) {
    console.log(`Fetching events for testnet block ${block}...`);
    try {
      const events = await fetchBlockEvents(rpcUrl, 'supra-testnet', block, block + 1);
      if (events.length > 0) {
        const targetEvents = events.filter(e => e.blockHeight === block.toString() || e.blockHeight === block || Number(e.blockHeight) === block);
        console.log(`Found ${targetEvents.length} target events in block ${block}. Processing...`);
        console.log("RAW EVENT PAYLOAD:", JSON.stringify(targetEvents, null, 2));
        if (targetEvents.length > 0) {
          await processEvents(targetEvents, null);
        }
        console.log(`Successfully processed block ${block}.`);
      } else {
        console.log(`No configured events found in block ${block}.`);
      }
    } catch (e: any) {
      console.error(`Failed on block ${block}: ${e.message}`);
    }
  }
  console.log('Done!');
}
main();
