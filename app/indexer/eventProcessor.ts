import { createLogger } from './utils'
import { sqliteDb } from '@/lib/prismadb';
import { RpcEvent } from './types';
import { 
  handleSpikeyAmmSwapEvent,
  handleDexlynSwapEvent,
  handleSyncEvent
} from './handlers';
import { handleDaoEvent } from './daoHandlers';

const logger = createLogger('eventProcessor');

const MODULE_PATH_SPIKEY_AMM = `${process.env.NEXT_PUBLIC_SUPRA_AMM_SPIKE_ADDRESS}::${process.env.NEXT_PUBLIC_SUPRA_AMM_SPIKE_PAIR_MODULE}`;
const MODULE_PATH_DEXLYN_AMM = `${process.env.NEXT_PUBLIC_AMM_DEXLYN_ADDRESS}::${process.env.NEXT_PUBLIC_AMM_DEXLYN_PAIR_MODULE}`;
const NEXT_PUBLIC_DAO_CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_DAO_CONTRACT_ADDRESS || "0x89f01d4584ce004510de6dc7ad8f3c5de5ec80c96d3c4ba5d71bdfe900899070";

export async function processEvents(events: RpcEvent[], tx: any): Promise<boolean> {
  logger.debug(`Processing ${events.length} RpcEvents in current batch.`);

  let createdNewData = false; // Initialize flag once for the entire batch

  for (const event of events) {
    const currentBlockHeight = event.blockHeight !== undefined ? BigInt(event.blockHeight) : BigInt(0);
    const currentTransactionHash = event.transactionHash || `unknown_tx_hash_for_${event.type}_block_${event.blockHeight}`;
    const currentSequenceNumber = event.sequence_number || `unknown_seq_num_for_${event.type}_block_${event.blockHeight}`;
    event.processedTransactionHash = currentTransactionHash;
    event.processedSequenceNumber = currentSequenceNumber;
    const eventUniqueIdentifierForLog = `Tx:${currentTransactionHash} Seq:${currentSequenceNumber} Type:${event.type} Net:${event.network}`;

    try {
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
            processed: false,
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

            // DAO Events (Economic Engine & Lifecycle)
            case `${NEXT_PUBLIC_DAO_CONTRACT_ADDRESS}::petra::DaoCreated`:
            case `${NEXT_PUBLIC_DAO_CONTRACT_ADDRESS}::jubilee::EpochAdvanced`:
            case `${NEXT_PUBLIC_DAO_CONTRACT_ADDRESS}::zeal::GaugeCreated`:
            case `${NEXT_PUBLIC_DAO_CONTRACT_ADDRESS}::zeal::Voted`:
            case `${NEXT_PUBLIC_DAO_CONTRACT_ADDRESS}::restore::BribeDeposited`:
            case `${NEXT_PUBLIC_DAO_CONTRACT_ADDRESS}::restore::BribeClaimed`:
            case `${NEXT_PUBLIC_DAO_CONTRACT_ADDRESS}::harvest::RewardsClaimed`:
            case `${NEXT_PUBLIC_DAO_CONTRACT_ADDRESS}::legacy::LockCreated`:
            case `${NEXT_PUBLIC_DAO_CONTRACT_ADDRESS}::legacy::LockExtended`:
            case `${NEXT_PUBLIC_DAO_CONTRACT_ADDRESS}::legacy::AmountIncreased`:
            case `${NEXT_PUBLIC_DAO_CONTRACT_ADDRESS}::legacy::LockMerged`:
            case `${NEXT_PUBLIC_DAO_CONTRACT_ADDRESS}::legacy::Withdrawn`:
            case `${NEXT_PUBLIC_DAO_CONTRACT_ADDRESS}::witness::VoteCast`:
            case `${NEXT_PUBLIC_DAO_CONTRACT_ADDRESS}::herald::ProposalCreated`:
            case `${NEXT_PUBLIC_DAO_CONTRACT_ADDRESS}::anchor::ProposalQueued`:
            case `${NEXT_PUBLIC_DAO_CONTRACT_ADDRESS}::anchor::ProposalExecuted`:
            case `${NEXT_PUBLIC_DAO_CONTRACT_ADDRESS}::anchor::ProposalCanceled`:
            case `${NEXT_PUBLIC_DAO_CONTRACT_ADDRESS}::charter::DaoConfigUpdated`:
            case `${NEXT_PUBLIC_DAO_CONTRACT_ADDRESS}::charter::GuardianUpdated`:
            case `${NEXT_PUBLIC_DAO_CONTRACT_ADDRESS}::sentinel::ProtocolPaused`:
            case `${NEXT_PUBLIC_DAO_CONTRACT_ADDRESS}::sentinel::ProtocolUnpaused`:
              handlerCreatedData = await handleDaoEvent(event, tx);
              break;

            default:
                logger.warn(`[${event.network}] Unknown event type: ${event.type}`);
        }
        if (handlerCreatedData) {
          createdNewData = true;
          logger.debug(`Debug: handlerCreatedData is true for event type ${event.type}. Setting createdNewData to true.`); // ADD THIS LINE
        }
        // ...

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
            },
        });
        logger.warn(`Error for event ${eventUniqueIdentifierForLog} has been logged to EventTracking.`);
      } catch (loggingError: any) {
        logger.error(`CRITICAL: Could not log the error to EventTracking for ${eventUniqueIdentifierForLog}. Logging Error: ${loggingError.message}`);
      }
    }
  }

  logger.info(`Finished processing batch of ${events.length} events.`);
  logger.debug(`Debug: processEvents returning createdNewData: ${createdNewData}`); // ADD THIS LINE
  return createdNewData;
}
        
