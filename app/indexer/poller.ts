import { fetchBlockEvents, fetchLatestBlockHeight } from './rpcClient'
import { processEvents } from './eventProcessor'
import { sleep, createLogger } from './utils'
import prismadb from '@/lib/prismadb'

const logger = createLogger('poller')

const BATCH_SIZE = 10 // Number of blocks to process in each batch
const MAX_RETRIES = 3
const POLLING_INTERVAL = 1 //1ms

interface PollerConfig {
  maxRequestsPerSecond: number
  startBlockHeight?: number
}

export class EventPoller {
  private isRunning: boolean = false
  private currentBlockHeight: number = 0
  private latestBlockHeight: number = 0
  private requestCount: number = 0
  private lastRequestTime: number = Date.now()
  private readonly maxRequestsPerSecond: number

  constructor(config: PollerConfig) {
    this.maxRequestsPerSecond = config.maxRequestsPerSecond
    if (config.startBlockHeight) {
      this.currentBlockHeight = config.startBlockHeight
    }
  }

  async initialize() {
    // Get the last processed block from database or use starting block
    const blockProgress = await prismadb.blockProgress.findFirst({
      where: { id: 1 }
    })

    if (blockProgress) {
      this.currentBlockHeight = Number(blockProgress.lastBlockHeight) + 1
    } else {
      // If no progress record exists, create one with starting block height
      const startBlock = process.env.START_BLOCK_HEIGHT ? 
        parseInt(process.env.START_BLOCK_HEIGHT) : 8270551 // Default starting block

      await prismadb.blockProgress.create({
        data: {
          id: 1,
          lastBlockHeight: BigInt(startBlock)
        }
      })
      
      this.currentBlockHeight = startBlock
    }

    this.latestBlockHeight = await fetchLatestBlockHeight()
    logger.info(`Initialized poller at block ${this.currentBlockHeight}`)
  }

  async start() {
    if (this.isRunning) return
    this.isRunning = true
    logger.info('Starting event poller')

    while (this.isRunning) {
      try {
        await this.processBatch()
        await this.updateLatestBlock()
        
        // If we've caught up, wait before checking for new blocks
        if (this.currentBlockHeight >= this.latestBlockHeight) {
          await sleep(POLLING_INTERVAL)
        }
      } catch (error) {
        logger.error('Error in polling loop:', error)
        //await sleep(POLLING_INTERVAL)
      }
    }
  }

  async stop() {
    this.isRunning = false
    logger.info('Stopping event poller')
  }

  private async processBatch() {
    const endBlock = Math.min(
      this.currentBlockHeight + BATCH_SIZE,
      this.latestBlockHeight
    )

    if (this.currentBlockHeight >= endBlock) {
      return
    }

    logger.info(`Processing blocks ${this.currentBlockHeight} to ${endBlock - 1}`)

    try {
      // Fetch events before transaction starts
      const events = await fetchBlockEvents(this.currentBlockHeight, endBlock)
      
      // Single transaction for all operations
      await prismadb.$transaction(async (tx) => {
        // Process all events first
        if (events.length > 0) {
          const processPromises = []
          const chunkSize = 10
          
          for (let i = 0; i < events.length; i += chunkSize) {
            const eventChunk = events.slice(i, i + chunkSize)
            processPromises.push(processEvents(eventChunk, tx))
          }

          // Wait for all chunks to complete
          await Promise.all(processPromises)
        }
        
        // Update block progress last, in same transaction
        return tx.blockProgress.update({
          where: { id: 1 },
          data: { lastBlockHeight: BigInt(endBlock - 1) }
        })
      }, {
        maxWait: 30000,
        timeout: 30000
      })

      this.currentBlockHeight = endBlock
      logger.info(`Updated block progress to ${endBlock - 1}`)
    } catch (error) {
      logger.error(`Error processing batch ${this.currentBlockHeight}-${endBlock - 1}:`, error)
      await sleep(POLLING_INTERVAL)
    }
  }

  private async updateLatestBlock() {
    try {
      this.latestBlockHeight = await fetchLatestBlockHeight()
    } catch (error) {
      logger.error('Error fetching latest block height:', error)
    }
  }

  private async recordFailedEvents(startBlock: number, endBlock: number, error: any) {
    try {
      await prismadb.eventTracking.create({
        data: {
          eventType: 'BATCH_PROCESSING',
          blockHeight: BigInt(startBlock),
          transactionHash: '', // Could be multiple in a batch
          processed: false,
          error: error.message || 'Unknown error'
        }
      })
    } catch (error) {
      logger.error('Error recording failed events:', error)
    }
  }
} 