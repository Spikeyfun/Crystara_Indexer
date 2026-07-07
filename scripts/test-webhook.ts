import 'dotenv/config';

async function fireTestEvent() {
  const DAO_WEBHOOK_URL = 'https://dao-hoglet-cloudflare.promisesimetry.workers.dev/api/indexer/webhook';
  const DAO_WEBHOOK_SECRET = 'hoglet_dao_prod_v1_88a91f42b3c1d9e7';
  const DAO_CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_DAO_CONTRACT_ADDRESS || '0x89f01d4584ce004510de6dc7ad8f3c5de5ec80c96d3c4ba5d71bdfe900899070';

  const mockEvent = {
    type: `${DAO_CONTRACT_ADDRESS}::herald::ProposalCreated`,
    guid: {
      creation_number: "42",
      account_address: DAO_CONTRACT_ADDRESS
    },
    sequence_number: "123",
    timestamp: Math.floor(Date.now() / 1000),
    data: {
      dao_address: DAO_CONTRACT_ADDRESS,
      proposal_id: 1,
      proposer: "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef",
      title: "Test Proposal from Local Indexer",
      start_time: Math.floor(Date.now() / 1000) + 3600,
      end_time: Math.floor(Date.now() / 1000) + 86400
    },
    network: "supra-testnet",
    blockHeight: "45000100",
    transactionHash: "0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890",
    processedTransactionHash: '',
    processedSequenceNumber: ''
  };

  console.log(`Firing test event to ${DAO_WEBHOOK_URL}...`);
  
  try {
    const response = await fetch(DAO_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-webhook-secret': DAO_WEBHOOK_SECRET
      },
      body: JSON.stringify(mockEvent)
    });

    if (response.ok) {
      console.log('✅ Test event fired successfully! Response:', response.status);
    } else {
      const text = await response.text();
      console.error('❌ Failed to fire test event. Status:', response.status, text);
    }
  } catch (e: any) {
    console.error('❌ Error firing test event:', e.message);
  }
}

fireTestEvent();
