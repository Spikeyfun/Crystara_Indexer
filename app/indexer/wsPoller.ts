import WebSocket from 'ws';
import { RpcEvent } from './types';
import { processEvents } from './eventProcessor';
import { createLogger, sleep } from './utils';
import { EVENT_TYPES_TO_FETCH } from './rpcClient';
import { supabaseDb } from '@/lib/prismadb';

const logger = createLogger('wsPoller');

export class WsEventPoller {
  private ws: WebSocket | null = null;
  private isRunning: boolean = false;
  private reconnectAttempts: number = 0;
  private readonly maxReconnectAttempts: number = 10;
  private readonly wsUrl: string;
  private readonly network: string;
  private pingInterval: NodeJS.Timeout | null = null;

  constructor(network: string) {
    this.network = network;
    // V4 WS endpoint based on Supra documentation
    this.wsUrl = network === 'supra-mainnet' 
      ? 'wss://rpc-mainnet.supra.com/rpc/v4/ws'
      : 'wss://rpc-testnet.supra.com/rpc/v4/ws';
  }

  async start() {
    if (this.isRunning) return;
    this.isRunning = true;
    logger.info(`[WS] Starting WebSocket poller for ${this.network} on ${this.wsUrl}`);
    this.connect();
  }

  private connect() {
    if (!this.isRunning) return;

    logger.info(`[WS] Connecting to ${this.wsUrl}...`);
    this.ws = new WebSocket(this.wsUrl);

    this.ws.on('open', () => {
      logger.info(`[WS] Connected successfully.`);
      this.reconnectAttempts = 0;
      
      // Subscribe to newBlocks with transactions
      const subscribeMsg = {
        jsonrpc: "2.0",
        method: "supra_subscribe",
        params: ["newBlocks", { includeTransactions: true, includeProof: false }],
        id: 1
      };
      
      this.ws?.send(JSON.stringify(subscribeMsg));
      logger.info(`[WS] Sent subscription request for newBlocks.`);

      // Keep connection alive
      this.pingInterval = setInterval(() => {
        if (this.ws?.readyState === WebSocket.OPEN) {
          this.ws.ping();
        }
      }, 30000);
    });

    this.ws.on('message', async (data: WebSocket.RawData) => {
      try {
        const payload = JSON.parse(data.toString());

        // Handle subscription confirmation
        if (payload.id === 1 && payload.result) {
          logger.info(`[WS] Subscription active. Sub ID: ${payload.result}`);
          return;
        }

        // Handle block notifications
        if (payload.method === 'supra_subscription' && payload.params?.result) {
          await this.handleBlock(payload.params.result);
        }
      } catch (err) {
        logger.error(`[WS] Error parsing message:`, err);
      }
    });

    this.ws.on('error', (err) => {
      logger.error(`[WS] Connection error:`, err);
    });

    this.ws.on('close', () => {
      logger.warn(`[WS] Connection closed.`);
      this.cleanup();
      this.reconnect();
    });
  }

  private async handleBlock(block: any) {
    if (!block || !block.transactions || !Array.isArray(block.transactions)) {
      return; // Not a valid block with transactions
    }

    const blockHeight = block.header?.height || block.block_height || 0;
    const eventsToProcess: RpcEvent[] = [];

    // Extract events from transactions
    for (const tx of block.transactions) {
      if (!tx.events || !Array.isArray(tx.events)) continue;

      for (const ev of tx.events) {
        // Filter against our whitelist
        if (EVENT_TYPES_TO_FETCH.includes(ev.type)) {
          let rawTs = Number(block.header?.timestamp || ev.data?.timestamp || 0);
          let eventTimestamp = 0;
          
          if (rawTs > 1e15) eventTimestamp = Math.floor(rawTs / 1e6);
          else if (rawTs > 1e12) eventTimestamp = Math.floor(rawTs / 1e3);
          else if (rawTs > 0) eventTimestamp = Math.floor(rawTs);

          eventsToProcess.push({
            type: ev.type,
            guid: ev.guid,
            sequence_number: String(ev.sequence_number),
            timestamp: eventTimestamp,
            data: ev.data,
            network: this.network,
            blockHeight: blockHeight.toString(),
            transactionHash: tx.hash || '',
            processedTransactionHash: '',
            processedSequenceNumber: ''
          });
        }
      }
    }

    if (eventsToProcess.length > 0) {
      logger.info(`[WS] Found ${eventsToProcess.length} target events in block ${blockHeight}. Processing...`);
      try {
        // We pass null for tx because processEvents manages its own transaction internally
        await processEvents(eventsToProcess, null);
        logger.info(`[WS] Successfully processed events from block ${blockHeight}`);
      } catch (err) {
        logger.error(`[WS] Failed to process events from block ${blockHeight}:`, err);
      }
    } else {
      if (Number(blockHeight) % 10 === 0) {
        logger.debug(`[WS] Processed up to block ${blockHeight} (no relevant events)`);
      }
    }
  }

  private reconnect() {
    if (!this.isRunning) return;

    this.reconnectAttempts++;
    if (this.reconnectAttempts > this.maxReconnectAttempts) {
      logger.error(`[WS] Max reconnect attempts reached. Giving up.`);
      return;
    }

    const delay = Math.min(5000 * Math.pow(1.5, this.reconnectAttempts), 60000);
    logger.info(`[WS] Attempting to reconnect in ${delay / 1000}s (Attempt ${this.reconnectAttempts})...`);
    
    setTimeout(() => {
      this.connect();
    }, delay);
  }

  private cleanup() {
    if (this.pingInterval) {
      clearInterval(this.pingInterval);
      this.pingInterval = null;
    }
  }

  stop() {
    logger.info(`[WS] Stopping WebSocket poller...`);
    this.isRunning = false;
    this.cleanup();
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }
}
