import { fetchBlockEvents, fetchLatestBlockHeight } from './rpcClient';
import { RpcEvent } from './types'; // Import RpcEvent from types.ts
import { processEvents } from './eventProcessor';
import { sleep, createLogger } from './utils';
import { supabaseDb } from '@/lib/prismadb';

const logger = createLogger('poller');

const BATCH_SIZE = 10;
const POLLING_INTERVAL = 2000;
const DEFAULT_PROGRESS_SAVE_INTERVAL_MS = 30 * 60 * 1000;

interface PollerInstanceConfig {
  maxRequestsPerSecond: number;
  progressSaveIntervalMs?: number;
}

export class EventPoller {
  private readonly pollerId: string;
  private readonly network: string;
  private readonly rpcUrl: string;
  private readonly maxRequestsPerSecond: number;
  private readonly progressSaveInterval: number;

  private isRunning: boolean = false;
  private currentBlockHeight: number = 0;
  private latestBlockHeight: number = 0;
  private lastProgressSaveTime: number = 0;
  private highestProcessedBlockInInterval: number = 0;
  private lastSavedBlockHeight: number = 0;
  private _newSqliteDataCreated: boolean = false;

  constructor(pollerId: string, network: string, rpcUrl: string, config: PollerInstanceConfig) {
    this.pollerId = pollerId;
    this.network = network;
    this.rpcUrl = rpcUrl;
    this.maxRequestsPerSecond = config.maxRequestsPerSecond;
    this.progressSaveInterval = config.progressSaveIntervalMs || DEFAULT_PROGRESS_SAVE_INTERVAL_MS;
    logger.info(`EventPoller instance created for ID: ${this.pollerId}, network: ${this.network}, RPC: ${this.rpcUrl}, Save Interval: ${this.progressSaveInterval / 1000 / 60} mins`);
  }

  async initialize() {
    logger.info(`[${this.pollerId}] Initializing...`);
    const blockProgress = await supabaseDb.blockProgress.findUnique({
      where: { network: this.network }
    });

    if (blockProgress) {
      this.lastSavedBlockHeight = Number(blockProgress.lastBlockHeight);
      this.currentBlockHeight = this.lastSavedBlockHeight + 1;
      this.highestProcessedBlockInInterval = this.lastSavedBlockHeight;
      logger.info(`[${this.pollerId}] Resuming from block ${this.currentBlockHeight} (last saved: ${this.lastSavedBlockHeight})`);
    } else {
      const defaultStartBlock = process.env[`START_BLOCK_HEIGHT_${this.network.toUpperCase()}`]
        ? parseInt(process.env[`START_BLOCK_HEIGHT_${this.network.toUpperCase()}`]!)
        : 1;
      
      logger.info(`[${this.pollerId}] No existing block progress record found for network ID '${this.network}'.`);
      logger.info(`[${this.pollerId}] Attempting to use start block from ENV var START_BLOCK_HEIGHT_${this.network.toUpperCase()}: ${process.env[`START_BLOCK_HEIGHT_${this.network.toUpperCase()}`]}`);
      logger.info(`[${this.pollerId}] Default start block determined as: ${defaultStartBlock}.`);

      this.currentBlockHeight = defaultStartBlock;
      this.lastSavedBlockHeight = defaultStartBlock - 1;
      this.highestProcessedBlockInInterval = defaultStartBlock - 1;
      
      logger.info(`[${this.pollerId}] Starting from block ${this.currentBlockHeight}. Creating new progress record with lastBlockHeight ${this.lastSavedBlockHeight}...`);
      try {
        await supabaseDb.blockProgress.create({
          data: {
            network: this.network,
            lastBlockHeight: BigInt(this.lastSavedBlockHeight),
          }
        });
        logger.info(`[${this.pollerId}] Successfully created new progress record.`);
      } catch (createError) {
        logger.error(`[${this.pollerId}] CRITICAL: Failed to create new progress record for ${this.network}:`, createError);
        throw new Error(`Failed to create initial block progress for ${this.network}. Poller cannot start.`);
      }
    }
    this.lastProgressSaveTime = Date.now();

    try {
      this.latestBlockHeight = await fetchLatestBlockHeight(this.rpcUrl);
      logger.info(`[${this.pollerId}] Initialized. Current Polling Block: ${this.currentBlockHeight}, Latest Chain Block: ${this.latestBlockHeight}`);
    } catch (error) {
      logger.error(`[${this.pollerId}] Failed to fetch latest block height during initialization:`, error);
      this.latestBlockHeight = this.currentBlockHeight;
    }
  }

  async start() {
    if (this.isRunning) {
      logger.warn(`[${this.pollerId}] Poller is already running.`);
      return;
    }
    this.isRunning = true;
    this.lastProgressSaveTime = Date.now();
    logger.info(`[${this.pollerId}] Starting event poller...`);
  
    while (this.isRunning) {
      try {
        if (!this.isRunning) break;
        
        await this.updateLatestBlockHeightIfNeeded();

        let processedSomethingInLoop = false;
        if (this.currentBlockHeight <= this.latestBlockHeight) {
          await this.processBatch();
          processedSomethingInLoop = true;
        }
        
        const now = Date.now();
        if (now - this.lastProgressSaveTime >= this.progressSaveInterval) {
          if (this.highestProcessedBlockInInterval > this.lastSavedBlockHeight) {
            await this.saveProgressToDb();
          } else {
            this.lastProgressSaveTime = now;
          }
        }

        if (!processedSomethingInLoop && !(this.currentBlockHeight <= this.latestBlockHeight) ) {
          await sleep(POLLING_INTERVAL);
        } else if (!processedSomethingInLoop) {
           await sleep(Math.min(POLLING_INTERVAL, 100));
        }

      } catch (error) {
        logger.error(`[${this.pollerId}] Error in polling loop:`, error instanceof Error ? error.message : String(error));
        await sleep(POLLING_INTERVAL * 2);
      }
    }
    logger.info(`[${this.pollerId}] Event poller loop ended. Attempting final progress save...`);
    await this.saveProgressToDb();
    logger.info(`[${this.pollerId}] Event poller fully stopped.`);
  }
  
  private async saveProgressToDb() {
    if (this.highestProcessedBlockInInterval <= this.lastSavedBlockHeight) {
      this.lastProgressSaveTime = Date.now();
      return;
    }
    try {
      logger.info(`[${this.pollerId}] Saving progress. LastBlockHeight: ${this.highestProcessedBlockInInterval}`);
      await supabaseDb.blockProgress.update({
        where: { network: this.network },
        data: { lastBlockHeight: BigInt(this.highestProcessedBlockInInterval) }
      });
      this.lastSavedBlockHeight = this.highestProcessedBlockInInterval;
      this.lastProgressSaveTime = Date.now();
      logger.info(`[${this.pollerId}] Successfully saved progress to DB. LastBlockHeight: ${this.lastSavedBlockHeight}`);
    } catch (error) {
      logger.error(`[${this.pollerId}] Failed to save progress to DB:`, error);
    }
  }

  async stop() {
    logger.info(`[${this.pollerId}] Attempting to stop event poller (setting isRunning to false)...`);
    this.isRunning = false;
  }

  public get newSqliteDataCreated(): boolean {
    return this._newSqliteDataCreated;
  }

  public resetNewSqliteDataCreated(): void {
    this._newSqliteDataCreated = false;
  }

  private async processBatch() {
    if (this.latestBlockHeight < this.currentBlockHeight) {
        await this.updateLatestBlockHeightIfNeeded();
        if (this.latestBlockHeight < this.currentBlockHeight) {
            logger.warn(`[${this.pollerId}] Latest block height (${this.latestBlockHeight}) is still behind current processing block (${this.currentBlockHeight}). Waiting.`);
            await sleep(POLLING_INTERVAL);
            return;
        }
    }

    const endBlock = Math.min(
      this.currentBlockHeight + BATCH_SIZE - 1,
      this.latestBlockHeight
    );

    if (this.currentBlockHeight > endBlock) {
      return;
    }

    logger.info(`[${this.pollerId}] Processing blocks ${this.currentBlockHeight} to ${endBlock} (Latest: ${this.latestBlockHeight})`);

    let events: RpcEvent[] = [];
    try {
      events = await fetchBlockEvents(this.rpcUrl, this.pollerId, this.currentBlockHeight, endBlock + 1);
      
      if (events.length > 0) {
        logger.info(`[${this.pollerId}] Fetched ${events.length} events from blocks ${this.currentBlockHeight}-${endBlock}.`);
        const createdData = await supabaseDb.$transaction(async (tx) => { // Transaction for processing events
            return await processEvents(events, tx);
        });
        if (createdData) {
          this._newSqliteDataCreated = true;
        }
      }
      this.highestProcessedBlockInInterval = endBlock;
      this.currentBlockHeight = endBlock + 1;
    } catch (error) {
      logger.error(`[${this.pollerId}] Error processing batch ${this.currentBlockHeight}-${endBlock}:`, error instanceof Error ? error.stack : String(error));
      throw error;
    }
  }

  private async updateLatestBlockHeightIfNeeded() {
    try {
      const newLatestBlockHeight = await fetchLatestBlockHeight(this.rpcUrl);
      if (newLatestBlockHeight > this.latestBlockHeight) {
        logger.info(`[${this.pollerId}] Updated latest block height from ${this.latestBlockHeight} to ${newLatestBlockHeight}`);
        this.latestBlockHeight = newLatestBlockHeight;
      }
    } catch (error) {
      logger.error(`[${this.pollerId}] Error fetching latest block height:`, error instanceof Error ? error.message : String(error));
    }
  }
}
