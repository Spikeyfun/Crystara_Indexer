import { RpcEvent, TransactionClient, DexlynSwapEventData } from '../types';
import { createLogger } from '../utils'
import { Prisma } from '@/generated/sqlite';
import { getOrCreateToken } from '../dbUtils'; // Import the new helper function

const logger = createLogger('dexlynSwapHandler');

export async function handleDexlynSwapEvent(event: RpcEvent, tx: TransactionClient) {
  const dexlynEventData = event.data as DexlynSwapEventData;
  logger.debug(`Processing DexlynSwapEvent`, dexlynEventData);
  logger.info(`Full event object:`, JSON.stringify(event, null, 2));

  // 1. Extraer metadatos del evento para la clave única
  const uniqueIdentifier = {
    network: event.network,
    transactionHash: event.processedTransactionHash,
    sequenceNumber: event.processedSequenceNumber,
  };

  // 2. Verificar si el evento ya existe en la base de datos
  const existingEvent = await tx.dexlynSwap.findUnique({
    where: {
      network_transactionHash_sequenceNumber: uniqueIdentifier,
    },
    select: { id: true },
  });

  // 3. Si no existe, crear el nuevo registro
  if (!existingEvent) {
    logger.info(`New DexlynSwapEvent found. Creating...`);

    // Find or create Token0 and Token1 using the centralized helper
    const token0 = await getOrCreateToken(dexlynEventData.pair_x, event.network, tx);
    const token1 = await getOrCreateToken(dexlynEventData.pair_y, event.network, tx);

    // Mapear los datos del evento al formato del modelo Prisma
    const swapData: Prisma.DexlynSwapCreateInput = {
      network: event.network,
      transactionHash: event.processedTransactionHash,
      sequenceNumber: event.processedSequenceNumber,
      blockNumber: BigInt(event.blockHeight || 0),
      blockTimestamp: new Date(Number(event.timestamp) * 1000), // Asumiendo que el timestamp del evento está en segundos
      curve: dexlynEventData.curve,
      xIn: BigInt(dexlynEventData.x_in),
      xOut: BigInt(dexlynEventData.x_out),
      yIn: BigInt(dexlynEventData.y_in),
      yOut: BigInt(dexlynEventData.y_out),
      timestamp: BigInt(dexlynEventData.timestamp),
      reserveX: BigInt(dexlynEventData.reserve_x),
      reserveY: BigInt(dexlynEventData.reserve_y),
      pair: {
        connectOrCreate: {
          where: {
            // Use the new unique constraint on token IDs
            network_token0Id_token1Id: {
              network: event.network,
              token0Id: token0.id,
              token1Id: token1.id,
            },
          },
          create: {
            network: event.network,
            token0: { connect: { id: token0.id } }, // Connect to existing Token
            token1: { connect: { id: token1.id } }, // Connect to existing Token
            // spikePairAddress is optional and not directly from DexlynSwapEventData
          },
        },
      },
    };

    await tx.dexlynSwap.create({
      data: swapData,
    });

    logger.info(`Successfully created DexlynSwapEvent.`);
  } else {
    logger.debug(`DexlynSwapEvent already exists. Skipping creation.`);
  }
}