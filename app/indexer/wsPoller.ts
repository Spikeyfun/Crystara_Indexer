import WebSocket from 'ws';
import { RpcEvent } from './types';
import { processEvents } from './eventProcessor';
import { createLogger } from './utils';
import { isTargetEvent } from './rpcClient';

const logger = createLogger('wsPoller');

const DEFAULT_MAINNET_WS_URLS = [
  'wss://rpc-mainnet-citadel.supra.com/rpc/v4/ws',
  'wss://rpc-mainnet.supra.com/rpc/v4/ws',
];

const DEFAULT_TESTNET_WS_URLS = [
  'wss://rpc-testnet.supra.com/rpc/v4/ws',
];

export class WsEventPoller {
  private ws: WebSocket | null = null;
  private isRunning: boolean = false;
  private isAlive: boolean = false;
  private reconnectAttempts: number = 0;
  private currentEndpointIndex: number = 0;
  private readonly wsUrls: string[];
  private readonly network: string;
  private pingInterval: NodeJS.Timeout | null = null;
  private reconnectTimer: NodeJS.Timeout | null = null;
  private lastReceivedBlockHeight: number = 0;

  constructor(network: string) {
    this.network = network;

    const envWsUrls = process.env.SUPRA_WS_URLS || process.env.SUPRA_WS_URL;
    if (envWsUrls) {
      this.wsUrls = envWsUrls.split(',').map((u) => u.trim()).filter(Boolean);
    } else {
      this.wsUrls = network === 'supra-mainnet' ? DEFAULT_MAINNET_WS_URLS : DEFAULT_TESTNET_WS_URLS;
    }
  }

  public get currentWsUrl(): string {
    return this.wsUrls[this.currentEndpointIndex % this.wsUrls.length];
  }

  public getStatus() {
    return {
      isRunning: this.isRunning,
      connected: this.ws?.readyState === WebSocket.OPEN,
      currentUrl: this.currentWsUrl,
      lastBlockHeight: this.lastReceivedBlockHeight,
      reconnectAttempts: this.reconnectAttempts,
    };
  }

  async start(): Promise<void> {
    if (this.isRunning) return;
    this.isRunning = true;
    logger.info(`[WS] Starting WebSocket poller for ${this.network} across ${this.wsUrls.length} endpoints`);
    this.connect();
  }

  private connect(): void {
    if (!this.isRunning) return;

    const targetUrl = this.currentWsUrl;
    logger.info(`[WS] Connecting to endpoint [${this.currentEndpointIndex + 1}/${this.wsUrls.length}]: ${targetUrl}`);

    try {
      this.ws = new WebSocket(targetUrl, {
        handshakeTimeout: 10000,
      });
    } catch (err) {
      logger.error(`[WS] WebSocket instant instantiation failure:`, err);
      this.scheduleReconnect();
      return;
    }

    this.isAlive = false;

    this.ws.on('open', () => {
      this.isAlive = true;
      this.reconnectAttempts = 0;
      logger.info(`[WS] Connected successfully to ${targetUrl}`);

      // Subscribe to newBlocks with transactions
      const subscribeMsg = {
        jsonrpc: '2.0',
        method: 'supra_subscribe',
        params: ['newBlocks', { includeTransactions: true, includeProof: false }],
        id: 1,
      };

      try {
        this.ws?.send(JSON.stringify(subscribeMsg));
        logger.info(`[WS] Sent subscription request for newBlocks.`);
      } catch (err) {
        logger.error(`[WS] Failed to send subscription request:`, err);
      }

      this.setupHeartbeat();
    });

    this.ws.on('pong', () => {
      this.isAlive = true;
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
        logger.error(`[WS] Error processing message payload:`, err);
      }
    });

    this.ws.on('error', (err: any) => {
      logger.error(`[WS] Socket error on ${targetUrl}: ${err?.message || err}`);
    });

    this.ws.on('close', (code, reason) => {
      logger.warn(`[WS] Connection closed (code: ${code}, reason: ${reason || 'none'}).`);
      this.cleanupSocket();
      this.scheduleReconnect();
    });
  }

  private setupHeartbeat(): void {
    this.cleanupHeartbeat();

    this.pingInterval = setInterval(() => {
      if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
        return;
      }

      if (!this.isAlive) {
        logger.warn(`[WS] Heartbeat timeout: no pong received within window. Terminating socket to trigger reconnect...`);
        this.ws.terminate();
        return;
      }

      this.isAlive = false;
      this.ws.ping();
    }, 20000);
  }

  private async handleBlock(block: any): Promise<void> {
    if (!block || !block.transactions || !Array.isArray(block.transactions)) {
      return;
    }

    const blockHeight = Number(block.header?.height ?? block.height ?? block.block_height ?? 0);
    if (blockHeight > 0) {
      this.lastReceivedBlockHeight = blockHeight;
    }

    const rawBlockTs = Number(block.header?.timestamp ?? block.timestamp ?? 0);
    const eventsToProcess: RpcEvent[] = [];

    // Extract events from transactions
    for (const tx of block.transactions) {
      const txHash = tx.hash || tx.tx_hash || tx.digest || '';
      
      // Events can be under tx.events OR tx.output.Move.events
      const txEvents = Array.isArray(tx.events) 
        ? tx.events 
        : Array.isArray(tx.output?.Move?.events)
          ? tx.output.Move.events
          : [];

      for (const ev of txEvents) {
        if (!ev || !ev.type) continue;

        if (isTargetEvent(ev.type)) {
          let rawTs = Number(ev.data?.timestamp || rawBlockTs || 0);
          let eventTimestamp = 0;

          if (rawTs > 1e15) eventTimestamp = Math.floor(rawTs / 1e6);
          else if (rawTs > 1e12) eventTimestamp = Math.floor(rawTs / 1e3);
          else if (rawTs > 0) eventTimestamp = Math.floor(rawTs);

          eventsToProcess.push({
            type: ev.type,
            guid: ev.guid,
            sequence_number: String(ev.sequence_number ?? ev.seq_num ?? '0'),
            timestamp: eventTimestamp,
            data: ev.data,
            network: this.network,
            blockHeight: blockHeight.toString(),
            transactionHash: txHash,
            processedTransactionHash: '',
            processedSequenceNumber: '',
          });
        }
      }
    }

    if (eventsToProcess.length > 0) {
      logger.info(`[WS] Block ${blockHeight}: captured ${eventsToProcess.length} target events. Dispatching to queue...`);
      try {
        await processEvents(eventsToProcess, null);
        logger.info(`[WS] Block ${blockHeight}: successfully processed ${eventsToProcess.length} events`);
      } catch (err: any) {
        logger.error(`[WS] Block ${blockHeight}: error processing events:`, err?.message || err);
      }
    } else {
      if (blockHeight % 50 === 0) {
        logger.debug(`[WS] Stream healthy at block ${blockHeight} (no target AMM/DAO events)`);
      }
    }
  }

  private scheduleReconnect(): void {
    if (!this.isRunning) return;

    this.reconnectAttempts++;
    // Rotate endpoint on reconnect
    this.currentEndpointIndex = (this.currentEndpointIndex + 1) % this.wsUrls.length;

    // Exponential backoff capped at 30 seconds: 1s, 2s, 4s, 8s, 16s, 30s
    const delay = Math.min(1000 * Math.pow(2, Math.min(this.reconnectAttempts - 1, 5)), 30000) + Math.random() * 500;
    const nextUrl = this.currentWsUrl;

    logger.info(
      `[WS] Reconnecting attempt ${this.reconnectAttempts} in ${(delay / 1000).toFixed(1)}s -> next endpoint: ${nextUrl}`
    );

    if (this.reconnectTimer) clearTimeout(this.reconnectTimer);
    this.reconnectTimer = setTimeout(() => {
      this.connect();
    }, delay);
  }

  private cleanupHeartbeat(): void {
    if (this.pingInterval) {
      clearInterval(this.pingInterval);
      this.pingInterval = null;
    }
  }

  private cleanupSocket(): void {
    this.cleanupHeartbeat();
    if (this.ws) {
      this.ws.removeAllListeners();
      try {
        this.ws.close();
      } catch (_) {}
      this.ws = null;
    }
  }

  stop(): void {
    logger.info(`[WS] Stopping WebSocket poller...`);
    this.isRunning = false;
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
    this.cleanupSocket();
  }
}
