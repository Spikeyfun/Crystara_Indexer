import { RpcEvent, TransactionClient, SpikeyAmmSwapEventData } from '../types';
import { createLogger } from '../utils';
import { Prisma } from '@/generated/sqlite';
import { getOrCreateToken, unpackPairAddresses } from '../dbUtils'; // Import unpackPairAddresses

const logger = createLogger('spikeyAmmSwapHandler');

export async function handleSpikeyAmmSwapEvent(event: RpcEvent, tx: TransactionClient): Promise<boolean> {
  const spikeyAmmSwapEventData = event.data as SpikeyAmmSwapEventData;
  logger.debug(`[${event.network}] Processing SpikeyAmmSwapEvent`, spikeyAmmSwapEventData);

  const uniqueIdentifier = {
    network: event.network,
    transactionHash: event.processedTransactionHash,
    eventIndex: parseInt(event.sequence_number),
  };

  const existingSpikeyAmmSwap = await tx.spikeyAmmSwap.findUnique({
    where: { network_transactionHash_eventIndex: uniqueIdentifier },
    select: { id: true },
  });

  if (!existingSpikeyAmmSwap) {
    logger.info(`[${event.network}] New SpikeyAmmSwapEvent found. Creating...`);

    let pairEntry = await tx.pair.findUnique({
      where: {
        network_spikeyAmmPairAddress: {
          network: event.network,
          spikeyAmmPairAddress: spikeyAmmSwapEventData.pair_address,
        },
      },
      include: {
        token0: true,
        token1: true,
      },
    });

    let token0Created = false;
    let token1Created = false;
    let pairCreated = false;

    if (!pairEntry) {
      logger.warn(`[${event.network}] Pair with spikeyAmmPairAddress ${spikeyAmmSwapEventData.pair_address} not found. Attempting to create it by unpacking tokens.`);
      
      let fetchedToken0Address: string;
      let fetchedToken1Address: string;

      try {
        const { token0Address, token1Address } = await unpackPairAddresses(event.network, spikeyAmmSwapEventData.pair_address);
        fetchedToken0Address = token0Address;
        fetchedToken1Address = token1Address;
      } catch (rpcError: any) {
        logger.error(`[${event.network}] Critical: Failed to unpack pair addresses for ${spikeyAmmSwapEventData.pair_address}. Cannot process swap. Error: ${rpcError.message}.`);
        throw rpcError;
      }

      const { token: tokenA, created: t0Created } = await getOrCreateToken(fetchedToken0Address, event.network, tx);
      const { token: tokenB, created: t1Created } = await getOrCreateToken(fetchedToken1Address, event.network, tx);
      
      token0Created = t0Created;
      token1Created = t1Created;

      const [sortedToken0, sortedToken1] = [tokenA, tokenB].sort((a, b) => a.address.localeCompare(b.address));

      const upsertResult = await tx.pair.upsert({
        where: {
          network_token0Id_token1Id: {
            network: event.network,
            token0Id: sortedToken0.id,
            token1Id: sortedToken1.id,
          }
        },
        update: {
          spikeyAmmPairAddress: spikeyAmmSwapEventData.pair_address,
        },
        create: {
          network: event.network,
          spikeyAmmPairAddress: spikeyAmmSwapEventData.pair_address,
          token0: { connect: { id: sortedToken0.id } },
          token1: { connect: { id: sortedToken1.id } },
        },
        include: {
          token0: true,
          token1: true,
        },
      });

      pairEntry = upsertResult;

      const now = new Date();
      const fiveSecondsAgo = new Date(now.getTime() - 5000);
      if (pairEntry.createdAt > fiveSecondsAgo) {
        pairCreated = true;
        logger.info(`[${event.network}] Created new Pair for spikeyAmmPairAddress ${spikeyAmmSwapEventData.pair_address}.`);
      } else {
        logger.info(`[${event.network}] Updated existing Pair with spikeyAmmPairAddress ${spikeyAmmSwapEventData.pair_address}.`);
      }
    }

    const swapData: Prisma.SpikeyAmmSwapCreateInput = {
      network: event.network,
      transactionHash: event.processedTransactionHash,
      eventIndex: parseInt(event.sequence_number),
      blockNumber: BigInt(event.blockHeight || 0),
      blockTimestamp: new Date(Number(event.timestamp) * 1000),
      sender: spikeyAmmSwapEventData.sender,
      to: spikeyAmmSwapEventData.to,
      amount0In: BigInt(spikeyAmmSwapEventData.amount0_in),
      amount1In: BigInt(spikeyAmmSwapEventData.amount1_in),
      amount0Out: BigInt(spikeyAmmSwapEventData.amount0_out),
      amount1Out: BigInt(spikeyAmmSwapEventData.amount1_out),
      pair: {
        connect: { id: pairEntry!.id },
      },
    };

    await tx.spikeyAmmSwap.create({
      data: swapData,
    });

    logger.info(`[${event.network}] Successfully created SpikeyAmmSwapEvent.`);
    return token0Created || token1Created || pairCreated;
  } else {
    logger.debug(`[${event.network}] SpikeyAmmSwapEvent already exists. Skipping creation.`);
    return false;
  }
}
