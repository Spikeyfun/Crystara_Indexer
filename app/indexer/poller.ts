import { fetchBlockEvents, fetchLatestBlockHeight } from './rpcClient';
import { RpcEvent } from './types'; // Import RpcEvent from types.ts
import { processEvents } from './eventProcessor';
import { sleep, createLogger } from './utils';
import { supabaseDb } from '@/lib/prismadb';

const logger = createLogger('poller');

const BATCH_SIZE = 50;
const POLLING_INTERVAL = 2000;
const DEFAULT_PROGRESS_SAVE_INTERVAL_MS = 30 * 60 * 1000;
// After this many consecutive failures on the SAME batch start we skip the
// batch to avoid a permanently stuck poller. 0 disables skipping.
const DEFAULT_MAX_BATCH_FAILURES_BEFORE_SKIP = 15;
// How recently the RPC tip must have been fetched successfully for a skip to
// be allowed (guards against skipping real blocks during an RPC outage).
const TIP_HEALTHY_WINDOW_MS = 120_000;

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

  // --- Stuck-poller detection ---
  private failedBatchStart: number = 0;
  private consecutiveBatchFailures: number = 0;
  private lastTipOkAt: number = 0;
  private readonly maxBatchFailuresBeforeSkip: number;

  constructor(pollerId: string, network: string, rpcUrl: string, config: PollerInstanceConfig) {
    this.pollerId = pollerId;
    this.network = network;
    this.rpcUrl = rpcUrl;
    this.maxRequestsPerSecond = config.maxRequestsPerSecond;
    this.progressSaveInterval = config.progressSaveIntervalMs || DEFAULT_PROGRESS_SAVE_INTERVAL_MS;
    this.maxBatchFailuresBeforeSkip = Math.max(
      0,
      parseInt(process.env.MAX_BATCH_FAILURES_BEFORE_SKIP || String(DEFAULT_MAX_BATCH_FAILURES_BEFORE_SKIP), 10)
    );
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
      this.lastTipOkAt = Date.now();
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
        await this.noteBatchFailure();
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

  /**
   * Records a batch failure. When the SAME batch start keeps failing AND the
   * infrastructure is otherwise healthy (RPC tip fresh, Supabase reachable),
   * the range is skipped so the poller can move on instead of stalling forever.
   */
  private async noteBatchFailure(): Promise<void> {
    if (this.maxBatchFailuresBeforeSkip <= 0) {
      return; // skipping disabled
    }

    const failedAt = this.currentBlockHeight;
    if (this.failedBatchStart === failedAt) {
      this.consecutiveBatchFailures++;
    } else {
      this.failedBatchStart = failedAt;
      this.consecutiveBatchFailures = 1;
    }

    if (this.consecutiveBatchFailures < this.maxBatchFailuresBeforeSkip) {
      return;
    }

    // Guard 1: only skip if the RPC tip was fetched successfully very recently,
    // so an RPC/network outage (where every batch fails) never skips real blocks.
    const tipHealthy = this.lastTipOkAt > 0 && (Date.now() - this.lastTipOkAt) < TIP_HEALTHY_WINDOW_MS;
    if (!tipHealthy) {
      logger.error(
        `[${this.pollerId}] Batch @${failedAt} failed ${this.consecutiveBatchFailures}x but the RPC tip is stale; ` +
        `NOT skipping (likely an RPC/network outage). Continuing to retry.`
      );
      return;
    }

    // Guard 2: only skip if Supabase is reachable, so a Supabase outage never
    // skips real blocks.
    if (!(await this.isSupabaseHealthy())) {
      logger.error(
        `[${this.pollerId}] Batch @${failedAt} failed ${this.consecutiveBatchFailures}x but Supabase is unreachable; ` +
        `NOT skipping. Continuing to retry.`
      );
      return;
    }

    const skipTo = Math.min(failedAt + BATCH_SIZE, this.latestBlockHeight + 1);
    if (skipTo <= failedAt) {
      return;
    }

    logger.error(
      `[${this.pollerId}] CRITICAL: batch @${failedAt} failed ${this.consecutiveBatchFailures}x with healthy infra. ` +
      `Skipping blocks ${failedAt}-${skipTo - 1} to unblock the poller. Events in this range WILL BE MISSING.`
    );
    this.highestProcessedBlockInInterval = Math.max(this.highestProcessedBlockInInterval, skipTo - 1);
    this.currentBlockHeight = skipTo;
    this.consecutiveBatchFailures = 0;
    this.failedBatchStart = 0;
  }

  private async isSupabaseHealthy(): Promise<boolean> {
    try {
      await supabaseDb.$queryRaw`SELECT 1`;
      return true;
    } catch {
      return false;
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
        // FIX (orden): ordenar por (blockHeight, sequence, type) antes de procesar.
        // El fetch agrupa por TIPO (eventos del mismo block pueden llegar desordenados
        // entre tipos) — handlers que asumen orden temporal (LockMerged después de
        // LockCreated, etc.) requieren el orden de ejecución real.
        events.sort((a: any, b: any) => {
          const bh = Number(a.blockHeight || 0) - Number(b.blockHeight || 0);
          if (bh !== 0) return bh;
          const sq = Number(a.sequence_number || 0) - Number(b.sequence_number || 0);
          if (sq !== 0) return sq;
          return String(a.type).localeCompare(String(b.type));
        });
        // NOTE: processEvents writes swaps to SQLite and manages its OWN
        // per-event sqlite transaction internally (the `tx` argument is
        // vestigial). Wrapping the batch in a supabase $transaction was a
        // no-op that held a Postgres/pooler connection open for the whole
        // batch and made the poller FAIL the batch whenever Supabase was
        // slow or unreachable — a silent full-pipeline stall. Removed.
        const createdData = await processEvents(events, null);
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
      const BLOCK_DELAY = 10; // Margen de seguridad para que la API de eventos se sincronice
      const rawLatestBlockHeight = await fetchLatestBlockHeight(this.rpcUrl);
      this.lastTipOkAt = Date.now();
      const newLatestBlockHeight = Math.max(0, rawLatestBlockHeight - BLOCK_DELAY);

      if (newLatestBlockHeight > this.latestBlockHeight) {
        logger.info(`[${this.pollerId}] Updated latest block height from ${this.latestBlockHeight} to ${newLatestBlockHeight} (Raw tip: ${rawLatestBlockHeight})`);
        this.latestBlockHeight = newLatestBlockHeight;
      }
    } catch (error) {
      logger.error(`[${this.pollerId}] Error fetching latest block height:`, error instanceof Error ? error.message : String(error));
    }
  }
}
