import { createLogger } from './utils'
import { sqliteDb } from '@/lib/prismadb';
import { RpcEvent } from './types';
import { 
  handleSpikeyAmmSwapEvent,
  handleDexlynSwapEvent,
  handleSyncEvent
} from './handlers';
import { handleDaoEventBatch } from './daoHandlers';

const logger = createLogger('eventProcessor');

const MODULE_PATH_SPIKEY_AMM = `${process.env.NEXT_PUBLIC_SUPRA_AMM_SPIKE_ADDRESS}::${process.env.NEXT_PUBLIC_SUPRA_AMM_SPIKE_PAIR_MODULE}`;
const MODULE_PATH_DEXLYN_AMM = `${process.env.NEXT_PUBLIC_AMM_DEXLYN_ADDRESS}::${process.env.NEXT_PUBLIC_AMM_DEXLYN_PAIR_MODULE}`;
const NEXT_PUBLIC_DAO_CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_DAO_CONTRACT_ADDRESS || "0x89f01d4584ce004510de6dc7ad8f3c5de5ec80c96d3c4ba5d71bdfe900899070";

/**
 * Is this event forwarded to the DAO webhook (D1 sync) rather than handled
 * locally in this indexer's own database?
 */
function isDaoWebhookEvent(type: string): boolean {
  const dao = NEXT_PUBLIC_DAO_CONTRACT_ADDRESS;
  return (
    type === `${dao}::petra::DaoCreated` ||
    type === `${dao}::jubilee::EpochAdvanced` ||
    type === `${dao}::zeal::GaugeCreated` ||
    type === `${dao}::zeal::Voted` ||
    type === `${dao}::restore::BribeDeposited` ||
    type === `${dao}::restore::BribeClaimed` ||
    type === `${dao}::harvest::RewardsClaimed` ||
    type === `${dao}::legacy::LockCreated` ||
    type === `${dao}::legacy::LockExtended` ||
    type === `${dao}::legacy::AmountIncreased` ||
    type === `${dao}::legacy::LockMerged` ||
    type === `${dao}::legacy::Withdrawn` ||
    type === `${dao}::witness::VoteCast` ||
    type === `${dao}::witness::LateQuorumExtended` ||
    type === `${dao}::legacy::RebaseCompounded` ||
    type === `${dao}::restore::BribeRolledOver` ||
    type === `${dao}::herald::ProposalCreated` ||
    type === `${dao}::anchor::ProposalQueued` ||
    type === `${dao}::anchor::ProposalExecuted` ||
    type === `${dao}::anchor::ProposalCanceled` ||
    type === `${dao}::charter::GuardianUpdated` ||
    type === `${dao}::sentinel::ProtocolPaused` ||
    type === `${dao}::sentinel::ProtocolUnpaused`
  );
}

export async function processEvents(events: RpcEvent[], tx: any): Promise<boolean> {
  logger.debug(`Processing ${events.length} RpcEvents in current batch.`);

  let createdNewData = false; // Initialize flag once for the entire batch

  // DAO events are NOT persisted locally: they are forwarded to the D1 webhook.
  // We collect them during the loop and send them in ONE batched POST at the
  // end (preserving order) instead of one HTTP round-trip per event.
  const daoBatch: RpcEvent[] = [];

  for (const event of events) {
    const currentBlockHeight = event.blockHeight !== undefined ? BigInt(event.blockHeight) : BigInt(0);
    const currentTransactionHash = event.transactionHash || `unknown_tx_hash_for_${event.type}_block_${event.blockHeight}`;
    const currentSequenceNumber = event.sequence_number || `unknown_seq_num_for_${event.type}_block_${event.blockHeight}`;
    event.processedTransactionHash = currentTransactionHash;
    event.processedSequenceNumber = currentSequenceNumber;
    const eventUniqueIdentifierForLog = `Tx:${currentTransactionHash} Seq:${currentSequenceNumber} Type:${event.type} Net:${event.network}`;

    try {
      // DAO webhook events: register tracking + queue for the batched POST.
      // (No local writes, so no per-event transaction is needed.)
      if (isDaoWebhookEvent(event.type)) {
        const eventTrackingEntry = await sqliteDb.eventTracking.upsert({
          where: {
            network_transactionHash_sequenceNumber_eventType: {
              network: event.network,
              transactionHash: currentTransactionHash,
              sequenceNumber: currentSequenceNumber,
              eventType: event.type,
            }
          },
          create: {
            network: event.network,
            eventType: event.type,
            blockHeight: currentBlockHeight,
            transactionHash: currentTransactionHash,
            sequenceNumber: currentSequenceNumber,
            processed: false,
            error: null,
          },
          update: {
            // Never reset `processed`: a re-polled SUCCEEDED event must stay
            // processed=true so the guard below skips it.
            error: null,
          },
        });

        if (eventTrackingEntry.processed) {
          logger.info(`Event ${eventUniqueIdentifierForLog} was already marked as processed. Skipping.`);
          continue;
        }

        daoBatch.push(event);
        continue; // commit + webhook flush happen after the loop
      }

      // AMM / local events: handled inline with a per-event transaction.
      await sqliteDb.$transaction(async (tx) => {
        logger.debug(`Starting transaction for event: ${eventUniqueIdentifierForLog}`);

        const eventTrackingEntry = await tx.eventTracking.upsert({
          where: {
            network_transactionHash_sequenceNumber_eventType: {
              network: event.network,
              transactionHash: currentTransactionHash,
              sequenceNumber: currentSequenceNumber,
              eventType: event.type,
            }
          },
          create: {
            network: event.network,
            eventType: event.type,
            blockHeight: currentBlockHeight,
            transactionHash: currentTransactionHash,
            sequenceNumber: currentSequenceNumber,
            processed: false,
            error: null,
          },
          update: {
            error: null,
          },
        });

        if (eventTrackingEntry.processed) {
          throw new Error('ALREADY_PROCESSED');
        }

        let handlerCreatedData = false; // Flag for current event handler
        switch (event.type) {
            case `${MODULE_PATH_SPIKEY_AMM}::SwapEvent`:
              handlerCreatedData = await handleSpikeyAmmSwapEvent(event, tx);
              break;
            case `${MODULE_PATH_SPIKEY_AMM}::SyncEvent`:
              handlerCreatedData = await handleSyncEvent(event, tx);
              break;
            case `${MODULE_PATH_DEXLYN_AMM}::SwapEvent`:
              handlerCreatedData = await handleDexlynSwapEvent(event, tx);
              break;

            default:
                logger.warn(`[${event.network}] Unknown event type: ${event.type}`);
        }
        if (handlerCreatedData) {
          createdNewData = true;
        }

        await tx.eventTracking.update({
          where: { id: eventTrackingEntry.id },
          data: {
            processed: true,
            error: null,
          },
        });
        
        logger.info(`Successfully processed and committed transaction for event ${eventUniqueIdentifierForLog}.`);

      }, {
        timeout: 30000, 
      });

    } catch (error: any) {
      if (error.message === 'ALREADY_PROCESSED') {
        logger.info(`Event ${eventUniqueIdentifierForLog} was already marked as processed. Skipping.`);
        continue;
      }

      const errorMessage = error.message || String(error);
      logger.error(`Transaction for event ${eventUniqueIdentifierForLog} FAILED and was rolled back. Error: ${errorMessage}`);
      
      try {
        await sqliteDb.eventTracking.updateMany({
            where: {
              network: event.network,
              transactionHash: currentTransactionHash,
              sequenceNumber: currentSequenceNumber,
              eventType: event.type,
            },
            data: {
              error: errorMessage.substring(0, 1000),
              processed: false,
              // Ver markDaoBatchFailed: refresca updatedAt para que un evento
              // que sigue fallando no expire de la ventana de 24h del retryJob.
              updatedAt: new Date(),
            },
        });
        logger.warn(`Error for event ${eventUniqueIdentifierForLog} has been logged to EventTracking.`);
      } catch (loggingError: any) {
        logger.error(`CRITICAL: Could not log the error to EventTracking for ${eventUniqueIdentifierForLog}. Logging Error: ${loggingError.message}`);
      }
    }
  }

  // Flush the DAO batch in a SINGLE POST (order preserved).
  if (daoBatch.length > 0) {
    try {
      await handleDaoEventBatch(daoBatch);

      // Mark all as processed only if the webhook accepted the whole batch.
      const ids = daoBatch.map((e) => `${e.network}|${e.processedTransactionHash}|${e.processedSequenceNumber}|${e.type}`);
      await markDaoBatchProcessed(daoBatch);
      createdNewData = true;
      logger.info(`DAO batch of ${daoBatch.length} events delivered and marked processed. ${ids.length} ids.`);
    } catch (err: any) {
      const errorMessage = err.message || String(err);
      logger.error(`DAO batch dispatch FAILED (${daoBatch.length} events). Marking unprocessed for retry. Error: ${errorMessage}`);
      await markDaoBatchFailed(daoBatch, errorMessage);
      // Do NOT throw: keep AMM processing results; the retryJob re-processes
      // the unprocessed DAO events on its next pass.
    }
  }

  logger.info(`Finished processing batch of ${events.length} events.`);
  return createdNewData;
}

async function markDaoBatchProcessed(batch: RpcEvent[]): Promise<void> {
  for (const e of batch) {
    try {
      await sqliteDb.eventTracking.updateMany({
        where: {
          network: e.network,
          transactionHash: e.processedTransactionHash,
          sequenceNumber: e.processedSequenceNumber,
          eventType: e.type,
        },
        data: { processed: true, error: null },
      });
    } catch (err: any) {
      logger.error(`Could not mark DAO event processed (${e.type}): ${err.message}`);
    }
  }
}

async function markDaoBatchFailed(batch: RpcEvent[], errorMessage: string): Promise<void> {
  for (const e of batch) {
    try {
      await sqliteDb.eventTracking.updateMany({
        where: {
          network: e.network,
          transactionHash: e.processedTransactionHash,
          sequenceNumber: e.processedSequenceNumber,
          eventType: e.type,
        },
        // `updatedAt` se refresca a propósito: EventTracking no tiene @updatedAt,
        // así que Prisma solo lo setea al INSERTAR. Sin esto, un evento que
        // sigue fallando mantiene su updatedAt original y, a las 24h, el
        // retryJob deja de verlo (filtra por `updatedAt >= now-24h`) — el evento
        // queda huérfano sin que nadie lo reintente más. Refrescarlo hace que
        // la ventana signifique "24h sin tocarse" en vez de "24h desde el
        // primer fallo", que es la semántica correcta para reintentos.
        data: { processed: false, error: errorMessage.substring(0, 1000), updatedAt: new Date() },
      });
    } catch (err: any) {
      logger.error(`Could not mark DAO event failed (${e.type}): ${err.message}`);
    }
  }
}
