import { RpcEvent, TransactionClient, DexlynSwapEventData } from '../types';
import { createLogger } from '../utils'
import { Prisma } from '@/prisma/generated/sqlite';
import { getOrCreateToken } from '../dbUtils';

const logger = createLogger('dexlynSwapHandler');

export async function handleDexlynSwapEvent(event: RpcEvent, tx: TransactionClient): Promise<boolean> {
  const dexlynEventData = event.data as DexlynSwapEventData;
  logger.debug(`Processing DexlynSwapEvent`, dexlynEventData);

  const uniqueIdentifier = {
    network: event.network,
    transactionHash: event.processedTransactionHash,
    sequenceNumber: event.processedSequenceNumber,
  };

  const existingEvent = await tx.dexlynSwap.findUnique({
    where: { network_transactionHash_sequenceNumber: uniqueIdentifier },
    select: { id: true },
  });

  if (!existingEvent) {
    logger.info(`New DexlynSwapEvent found. Creating...`);

    // ===== PASO 1: Obtener o crear los tokens como antes =====
    const { token: tokenA, created: token0Created } = await getOrCreateToken(dexlynEventData.pair_x, event.network, tx);
    const { token: tokenB, created: token1Created } = await getOrCreateToken(dexlynEventData.pair_y, event.network, tx);

    // ===== PASO 2: Ordenar los tokens alfabéticamente para tu clave única estándar =====
    const [sortedToken0, sortedToken1] = [tokenA, tokenB].sort((a, b) => a.address.localeCompare(b.address));
    
    // ===== PASO 3 (LA CORRECCIÓN CLAVE): Usar 'upsert' en el par para crear o actualizar =====
    // 'upsert' nos permite añadir la dirección de Dexlyn tanto si el par es nuevo como si ya existía.
    const pairEntry = await tx.pair.upsert({
      where: {
        // La clave para encontrar el par es siempre la combinación ordenada alfabéticamente
        network_token0Id_token1Id: {
          network: event.network,
          token0Id: sortedToken0.id,
          token1Id: sortedToken1.id,
        },
      },
      // --- QUÉ HACER SI EL PAR YA EXISTE ---
      // Si el par ya existía (ej. creado por Spikey), solo actualizamos el campo de Dexlyn.
      update: {
        dexlynAmmTokenXAddress: dexlynEventData.pair_x,
      },
      // --- QUÉ HACER SI EL PAR NO EXISTE ---
      // Si es nuevo, lo creamos con toda la información.
      create: {
        network: event.network,
        token0: { connect: { id: sortedToken0.id } },
        token1: { connect: { id: sortedToken1.id } },
        dexlynAmmTokenXAddress: dexlynEventData.pair_x, // ¡Guardamos la dirección del token X!
      },
    });
    
    // Determinar si el par fue recién creado para el logging y el retorno
    const now = new Date();
    const fiveSecondsAgo = new Date(now.getTime() - 5000);
    const pairCreated = pairEntry.createdAt > fiveSecondsAgo;

    // ===== PASO 4: Crear el registro de swap, conectándolo al par que acabamos de encontrar/crear/actualizar =====
    const swapData: Prisma.DexlynSwapCreateInput = {
      network: event.network,
      transactionHash: event.processedTransactionHash,
      sequenceNumber: event.processedSequenceNumber,
      blockNumber: BigInt(event.blockHeight || 0),
      blockTimestamp: new Date(Number(event.timestamp) * 1000),
      curve: dexlynEventData.curve,
      xIn: BigInt(dexlynEventData.x_in),
      xOut: BigInt(dexlynEventData.x_out),
      yIn: BigInt(dexlynEventData.y_in),
      yOut: BigInt(dexlynEventData.y_out),
      timestamp: BigInt(dexlynEventData.timestamp),
      reserveX: BigInt(dexlynEventData.reserve_x),
      reserveY: BigInt(dexlynEventData.reserve_y),
      pair: {
        connect: { id: pairEntry.id }, // Conectamos con el ID del par que obtuvimos del upsert
      },
    };

    await tx.dexlynSwap.create({
      data: swapData,
    });

    logger.info(`Successfully created DexlynSwapEvent.`);
    return token0Created || token1Created || pairCreated;
  } else {
    logger.debug(`DexlynSwapEvent already exists. Skipping creation.`);
    return false;
  }
}