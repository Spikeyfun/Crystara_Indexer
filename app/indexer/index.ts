import { EventPoller } from './poller'
import { WsEventPoller } from './wsPoller'
import { createLogger } from './utils'
import {
  SUPRA_RPC_URL_TESTNET,
  SUPRA_RPC_URL_MAINNET,
  CHAIN_ID_SUPRA_TESTNET,
  CHAIN_ID_SUPRA_MAINNET
} from './rpcClient'
import { startScheduledTasks, stopScheduledTasks, NetworkConfig as SchedulerNetworkConfig } from '../../lib/TaskProcessor';

const logger = createLogger('indexer')

let indexerActive = false;

interface PollerInstances {
  testnet?: EventPoller;
  mainnet?: EventPoller;
  testnetWs?: WsEventPoller;
  mainnetWs?: WsEventPoller;
}
let pollers: PollerInstances = {};

const POLLER_IDS = {
  TESTNET: 'supra-testnet',
  MAINNET: 'supra-mainnet'
};

interface SchedulerStartupConfig {
  testnet?: SchedulerNetworkConfig;
  mainnet?: SchedulerNetworkConfig;
}

export async function startIndexer() {
  const indexerRun = process.env.INDEXER_RUN || 'all'; 
  const schedulerConfig: SchedulerStartupConfig = {};

  const shouldRunTestnet = SUPRA_RPC_URL_TESTNET && CHAIN_ID_SUPRA_TESTNET && (indexerRun === 'all' || indexerRun === 'dev');
  const shouldRunMainnet = SUPRA_RPC_URL_MAINNET && CHAIN_ID_SUPRA_MAINNET && (indexerRun === 'all' || indexerRun === 'prod');

  if (shouldRunTestnet) {
    schedulerConfig.testnet = {
      rpcUrl: SUPRA_RPC_URL_TESTNET,
      networkName: POLLER_IDS.TESTNET 
    };
  }
  if (shouldRunMainnet) {
    schedulerConfig.mainnet = {
      rpcUrl: SUPRA_RPC_URL_MAINNET,
      networkName: POLLER_IDS.MAINNET 
    };
  }

  if (indexerActive && (pollers.testnet || pollers.mainnet)) {
    logger.info('Indexer is already running or starting.');
    const pollersMap = new Map<string, EventPoller>();
    if (pollers.testnet) pollersMap.set(POLLER_IDS.TESTNET, pollers.testnet);
    if (pollers.mainnet) pollersMap.set(POLLER_IDS.MAINNET, pollers.mainnet);
    startScheduledTasks(schedulerConfig, pollersMap); 
    return;
  }

  logger.info('Starting Supra Chain Indexer (Hybrid REST + WS) for Testnet and Mainnet...');
  indexerActive = true;

  const pollerConfigBase = {
    maxRequestsPerSecond: parseInt(process.env.MAX_REQUESTS_PER_SECOND || '10', 10),
  };

  if (shouldRunTestnet) {
    logger.info(`Setting up REST & WS pollers for Testnet (ID: ${POLLER_IDS.TESTNET})`);
    pollers.testnet = new EventPoller(
      POLLER_IDS.TESTNET, 
      CHAIN_ID_SUPRA_TESTNET,
      SUPRA_RPC_URL_TESTNET,
      pollerConfigBase
    );
    pollers.testnetWs = new WsEventPoller(CHAIN_ID_SUPRA_TESTNET);
  } else {
    logger.warn(`Testnet poller disabled.`);
  }

  if (shouldRunMainnet) {
    logger.info(`Setting up REST & WS pollers for Mainnet (ID: ${POLLER_IDS.MAINNET})`);
    pollers.mainnet = new EventPoller(
      POLLER_IDS.MAINNET, 
      CHAIN_ID_SUPRA_MAINNET,
      SUPRA_RPC_URL_MAINNET,
      pollerConfigBase
    );
    pollers.mainnetWs = new WsEventPoller(CHAIN_ID_SUPRA_MAINNET);
  } else {
    logger.warn(`Mainnet poller disabled.`);
  }

  const startingPollers: Promise<void>[] = [];
  
  // Initialize and start REST Pollers (Catch-up)
  if (pollers.testnet) {
    startingPollers.push(
      pollers.testnet.initialize().then(() => pollers.testnet!.start())
      .catch(err => {
        logger.error(`Error starting Testnet REST poller:`, err);
        pollers.testnet = undefined;
      })
    );
  }
  if (pollers.mainnet) {
    startingPollers.push(
      pollers.mainnet.initialize().then(() => pollers.mainnet!.start())
      .catch(err => {
        logger.error(`Error starting Mainnet REST poller:`, err);
        pollers.mainnet = undefined;
      })
    );
  }

  // Start WS Pollers (Real-time tip)
  if (process.env.ENABLE_WS === 'true') {
    if (pollers.testnetWs) pollers.testnetWs.start();
    if (pollers.mainnetWs) pollers.mainnetWs.start();
    logger.info('WebSocket Pollers started.');
  } else {
    logger.info('WebSocket Pollers disabled (ENABLE_WS != true). Running in REST-only mode.');
  }

  if (startingPollers.length === 0 && Object.keys(schedulerConfig).length === 0) {
    logger.warn('No pollers were configured or started, and no scheduler config provided. Indexer effectively idle.');
    indexerActive = false; 
    return; 
  } else if (startingPollers.length === 0 && Object.keys(schedulerConfig).length > 0) {
     logger.warn('No pollers were configured or started, but scheduler config provided. Attempting to start scheduled tasks.');
  }

  const pollersMap = new Map<string, EventPoller>();
  if (pollers.testnet) pollersMap.set(POLLER_IDS.TESTNET, pollers.testnet);
  if (pollers.mainnet) pollersMap.set(POLLER_IDS.MAINNET, pollers.mainnet);
  startScheduledTasks(schedulerConfig, pollersMap);

  if (startingPollers.length > 0) {
    try {
      await Promise.all(startingPollers);
      logger.info('All configured indexer pollers started (or attempted to start).');
    } catch (error) {
      logger.error('An error occurred during the startup of one or more pollers:', error);
    }
  }
}

export async function stopIndexer() {
  logger.info('Stopping Supra Chain Indexer...');
  indexerActive = false; 

  stopScheduledTasks();

  const stoppingPollers: Promise<void>[] = [];
  if (pollers.testnet) {
    logger.info(`Stopping Testnet REST poller...`);
    stoppingPollers.push(pollers.testnet.stop().catch(err => logger.error(`Error stopping Testnet REST poller:`, err)));
  }
  if (pollers.mainnet) {
    logger.info(`Stopping Mainnet REST poller...`);
    stoppingPollers.push(pollers.mainnet.stop().catch(err => logger.error(`Error stopping Mainnet REST poller:`, err)));
  }

  if (pollers.testnetWs) {
    logger.info(`Stopping Testnet WS poller...`);
    pollers.testnetWs.stop();
  }
  if (pollers.mainnetWs) {
    logger.info(`Stopping Mainnet WS poller...`);
    pollers.mainnetWs.stop();
  }

  if (stoppingPollers.length > 0) {
    await Promise.all(stoppingPollers);
  }
  
  pollers = {}; 
  logger.info('Indexer pollers stopped (or attempted to stop).');
}

export function checkIndexerStatus() {
  let status = `Indexer service is ${indexerActive ? 'active' : 'inactive'}.`;
  if (indexerActive) {
    status += ` Testnet poller: ${pollers.testnet ? 'configured' : 'not configured/failed'}.`;
    status += ` Mainnet poller: ${pollers.mainnet ? 'configured' : 'not configured/failed'}.`;
  }
  return status;
}

export default {
  async fetch(request: Request, env: any, ctx: any) {
    const url = new URL(request.url);
    if (url.pathname === "/status") {
      return new Response(checkIndexerStatus());
    }
    if (url.pathname === "/start") {
      ctx.waitUntil(startIndexer()); 
      return new Response("Indexer start initiated.");
    }
    if (url.pathname === "/stop") {
      ctx.waitUntil(stopIndexer()); 
      return new Response("Indexer stop initiated.");
    }
    return new Response('Indexer Worker Running. Use /status, /start, or /stop.');
  },

  async scheduled(event: any, env: any, ctx: any) {
    logger.info('Scheduled event triggered. Ensuring indexer is running...');
    ctx.waitUntil(startIndexer());
  }
}