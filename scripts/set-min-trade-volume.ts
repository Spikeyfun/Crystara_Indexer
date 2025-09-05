import { sqliteDb } from '../lib/prismadb';
import { Prisma } from '@/prisma/generated/sqlite';

async function setMinTradeVolume() {
  console.log('Setting minimum trade volume for SUPRA and ETH...');
  try {
    const supraAddress = '0x1::supra_coin::SupraCoin';
    const ethAddress = '0xe4af154ade9551e7f58a23b8f727ae2dca050f1b74582bb518ba361c889d246d';
    const network = 'supra-mainnet'; // Assuming this is the network

    await sqliteDb.token.update({
      where: {
        network_address: {
            network: network,
            address: supraAddress
        }
      },
      data: {
        minTradeVolume: new Prisma.Decimal(1),
      },
    });
    console.log(`Successfully set minTradeVolume for SUPRA to 1`);

    await sqliteDb.token.update({
      where: {
        network_address: {
            network: network,
            address: ethAddress
        }
      },
      data: {
        minTradeVolume: new Prisma.Decimal(0.0001),
      },
    });
    console.log(`Successfully set minTradeVolume for ETH to 0.0001`);

  } catch (error) {
    console.error('An error occurred while setting the min trade volume:', error);
  } finally {
    await sqliteDb.$disconnect();
  }
}

setMinTradeVolume();
