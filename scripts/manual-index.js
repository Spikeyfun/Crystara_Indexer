require('dotenv').config();
// Fix for CommonJS
async function main() {
  const { fetchBlockEvents } = await import('../app/indexer/rpcClient.ts');
  const { processEvents } = await import('../app/indexer/eventProcessor.ts');
  // I will just use tsx directly without changing the original file to JS
}
