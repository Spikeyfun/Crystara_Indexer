import { unpackPairAddresses } from '../app/indexer/dbUtils';
import { createLogger } from '../app/indexer/utils';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

const logger = createLogger('test-unpack');
const PAIR_ADDRESS_TO_TEST = '0x7117dce3b042245f8b4f1a4e35cd0f63ff10200c4e8b9e67dbb9c6ab82626321';

async function testUnpack() {
  logger.info(`Testing unpackPairAddresses for pair: ${PAIR_ADDRESS_TO_TEST}`);

  try {
    const { token0Address, token1Address } = await unpackPairAddresses('supra-mainnet', PAIR_ADDRESS_TO_TEST);
    console.log('\n--- RESULT ---');
    console.log(`Pair Address Tested: ${PAIR_ADDRESS_TO_TEST}`);
    console.log(`Token 0 Returned:  ${token0Address}`);
    console.log(`Token 1 Returned:  ${token1Address}`);
    console.log('----------------\n');
  } catch (error: any) {
    console.error('\n--- ERROR ---');
    console.error(`Failed to unpack pair ${PAIR_ADDRESS_TO_TEST}:`, error.message);
    console.error('--------------- ');
  }
}

testUnpack();
