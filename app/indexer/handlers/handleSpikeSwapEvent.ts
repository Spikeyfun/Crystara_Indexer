import { RpcEvent, TransactionClient, SpikeyAmmSwapEventData } from '../types';
import { createLogger } from '../utils';
import { Prisma } from '@/generated/sqlite';
import { getOrCreateToken, unpackPairAddresses } from '../dbUtils'; // Import unpackPairAddresses

const logger = createLogger('spikeyAmmSwapHandler');

export async function handleSpikeyAmmSwapEvent(event: RpcEvent, tx: TransactionClient) {
  const spikeyAmmSwapEventData = event.data as SpikeyAmmSwapEventData;
  logger.debug(`[${event.network}] Processing SpikeyAmmSwapEvent`, spikeyAmmSwapEventData);

  // 1. Extraer metadatos del evento para la clave única
  const uniqueIdentifier = {
    network: event.network,
    transactionHash: event.processedTransactionHash,
    eventIndex: parseInt(event.sequence_number), // Assuming sequence_number can be used as eventIndex
  };

  // 2. Verificar si el evento ya existe en la base de datos
  const existingSpikeyAmmSwap = await tx.spikeyAmmSwap.findUnique({
    where: {
      network_transactionHash_eventIndex: uniqueIdentifier,
    },
    select: { id: true },
  });

  // 3. Si no existe, crear el nuevo registro
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

    let token0Id: number;
    let token1Id: number;

    if (!pairEntry) {
      logger.warn(`[${event.network}] Pair with spikeyAmmPairAddress ${spikeyAmmSwapEventData.pair_address} not found. Attempting to fetch token addresses from blockchain.`);
      
      let fetchedToken0Address: string;
      let fetchedToken1Address: string;

      try {
        const { token0Address, token1Address } = await unpackPairAddresses(event.network, spikeyAmmSwapEventData.pair_address);
        fetchedToken0Address = token0Address;
        fetchedToken1Address = token1Address;
      } catch (rpcError: any) {
        logger.error(`[${event.network}] Failed to unpack pair addresses for ${spikeyAmmSwapEventData.pair_address}. Error: ${rpcError.message}. Using placeholder addresses.`);
        // Fallback to placeholder addresses if RPC fails
        fetchedToken0Address = `0x${spikeyAmmSwapEventData.pair_address.substring(2, 10)}::token0::Token`; // Placeholder
        fetchedToken1Address = `0x${spikeyAmmSwapEventData.pair_address.substring(10, 18)}::token1::Token`; // Placeholder
      }

      const token0 = await getOrCreateToken(fetchedToken0Address, event.network, tx);
      const token1 = await getOrCreateToken(fetchedToken1Address, event.network, tx);
      token0Id = token0.id;
      token1Id = token1.id;

      pairEntry = await tx.pair.create({
        data: {
          network: event.network,
          spikeyAmmPairAddress: spikeyAmmSwapEventData.pair_address,
          token0: { connect: { id: token0Id } },
          token1: { connect: { id: token1Id } },
        },
        include: { // Add include to the create operation
          token0: true,
          token1: true,
        },
      });
      logger.info(`[${event.network}] Created new Pair for spikeyAmmPairAddress ${spikeyAmmSwapEventData.pair_address}.`);
    } else {
      token0Id = pairEntry.token0Id;
      token1Id = pairEntry.token1Id;
      logger.debug(`[${event.network}] Found existing Pair for spikeyAmmPairAddress ${spikeyAmmSwapEventData.pair_address}.`);
    }

    // Mapear los datos del evento al formato del modelo Prisma
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
  } else {
    logger.debug(`[${event.network}] SpikeyAmmSwapEvent already exists. Skipping creation.`);
  }
}
