import WebSocket from 'ws';

const CITADEL_WS_URL = 'wss://rpc-mainnet-citadel.supra.com/rpc/v4/ws';

async function testCitadelWsConnection() {
  console.log(`--- Testing Citadel WSS Connection: ${CITADEL_WS_URL} ---`);
  
  return new Promise<void>((resolve, reject) => {
    const ws = new WebSocket(CITADEL_WS_URL, {
      handshakeTimeout: 10000,
    });

    let receivedBlocks = 0;
    const targetBlocks = 2;
    const timeout = setTimeout(() => {
      ws.close();
      reject(new Error(`Timed out waiting for ${targetBlocks} blocks from Citadel WSS`));
    }, 20000);

    ws.on('open', () => {
      console.log('✅ Connected successfully to Citadel WSS');

      const subscribeMsg = {
        jsonrpc: '2.0',
        method: 'supra_subscribe',
        params: ['newBlocks', { includeTransactions: true, includeProof: false }],
        id: 1,
      };

      ws.send(JSON.stringify(subscribeMsg));
      console.log('📡 Sent supra_subscribe request for newBlocks');
    });

    ws.on('message', (data: WebSocket.RawData) => {
      try {
        const payload = JSON.parse(data.toString());

        if (payload.id === 1 && payload.result) {
          console.log(`✅ Subscription confirmed! Sub ID: ${payload.result}`);
          return;
        }

        if (payload.method === 'supra_subscription' && payload.params?.result) {
          receivedBlocks++;
          const block = payload.params.result;
          const height = block.header?.height ?? block.height ?? block.block_height ?? 'unknown';
          const txCount = Array.isArray(block.transactions) ? block.transactions.length : 0;
          
          let eventCount = 0;
          if (Array.isArray(block.transactions)) {
            for (const tx of block.transactions) {
              const events = tx.output?.Move?.events || tx.events || [];
              if (Array.isArray(events)) {
                eventCount += events.length;
              }
            }
          }

          console.log(`📦 Received Block #${receivedBlocks}: Height ${height} | Txs: ${txCount} | Move Events: ${eventCount}`);

          if (receivedBlocks >= targetBlocks) {
            clearTimeout(timeout);
            ws.close();
            console.log('🎉 Live Citadel WSS subscription verified successfully!');
            resolve();
          }
        }
      } catch (err) {
        console.error('Error handling message:', err);
      }
    });

    ws.on('error', (err) => {
      clearTimeout(timeout);
      reject(err);
    });

    ws.on('close', (code) => {
      if (receivedBlocks < targetBlocks) {
        clearTimeout(timeout);
        reject(new Error(`Socket closed prematurely with code ${code}`));
      }
    });
  });
}

testCitadelWsConnection()
  .then(() => {
    console.log('Test completed with exit code 0');
    process.exit(0);
  })
  .catch((err) => {
    console.error('❌ WSS Test Failed:', err.message || err);
    process.exit(1);
  });
