import { createLogger } from '../app/indexer/utils';
import cron, { ScheduledTask } from 'node-cron';
import { executeOhlcAggregation } from './tasks/executeOhlcAggregation';
import { synchronizeDatabases } from './tasks/executeSyncDb'; // <-- Importar la nueva tarea
import { sqliteDb as prismadb } from '@/lib/prismadb';

const logger = createLogger('task-processor');

export interface NetworkConfig {
  rpcUrl: string;
  chainId: string;
  networkName: string;
}

interface SchedulerSetupConfig {
  testnet?: NetworkConfig;
  mainnet?: NetworkConfig;
}

let activeJobs: Map<string, ScheduledTask> = new Map();

async function runUpdateCycleForNetwork(networkConfig: NetworkConfig) {
  logger.info(`[${networkConfig.networkName}] Starting update cycle...`);
  try {
    // Paso 1: Sincronizar DBs
    logger.info(`[${networkConfig.networkName}] Executing DB Synchronization...`);
    await synchronizeDatabases(networkConfig.networkName);
    logger.info(`[${networkConfig.networkName}] DB Synchronization COMPLETED.`);

    // Paso 2: Agregar OHLC
    logger.info(`[${networkConfig.networkName}] Executing OHLC Aggregation...`);
    await executeOhlcAggregation(networkConfig.networkName);
    logger.info(`[${networkConfig.networkName}] OHLC Aggregation COMPLETED.`);

    logger.info(`[${networkConfig.networkName}] Update cycle finished successfully.`);
  } catch (error) {
    logger.error(`[${networkConfig.networkName}] Error during update cycle:`, error);
  }
}

export function startScheduledTasks(setupConfig: SchedulerSetupConfig): void {
  if (activeJobs.size > 0) {
    logger.info('Scheduled tasks might already be initialized. Check activeJobs map if issues.');
    return;
  }

  logger.info('Initializing/Updating scheduled tasks...');

  const networksToProcess: NetworkConfig[] = [];
  if (setupConfig.testnet) {
    networksToProcess.push(setupConfig.testnet);
  }
  if (setupConfig.mainnet) {
    networksToProcess.push(setupConfig.mainnet);
  }

  if (networksToProcess.length === 0) {
    logger.warn('No network configurations provided. No tasks will be started.');
    return;
  }

  networksToProcess.forEach(networkConfig => {
    const masterUpdateTaskKey = `${networkConfig.networkName}-OhlcAggregationCycle`;

    if (!activeJobs.has(masterUpdateTaskKey)) {
      logger.info(`Setting up OHLC Aggregation task for ${networkConfig.networkName}`);

      // Ejecutar cada minuto.
      const schedule = '* * * * *';

      const job: ScheduledTask = cron.schedule(schedule, async () => {
        logger.info(`Triggering OHLC Aggregation for ${networkConfig.networkName} (cron: ${schedule})`);
        await runUpdateCycleForNetwork(networkConfig);
      }, { timezone: "UTC" });

      activeJobs.set(masterUpdateTaskKey, job);
      logger.info(`OHLC Aggregation task for ${networkConfig.networkName} scheduled with cron: ${schedule}.`);
    } else {
      logger.info(`Master Update Cycle task for ${networkConfig.networkName} is already scheduled.`);
    }
  });

  if (activeJobs.size > 0) {
    logger.info(`${activeJobs.size} task(s) configured and started/verified with node-cron.`);
  } else {
    logger.warn('No scheduled tasks were ultimately configured.');
  }
}

export function stopScheduledTasks(): void {
  // ... (la función stopScheduledTasks no necesita cambios)
  if (activeJobs.size === 0) {
    return;
  }
  logger.info(`Stopping ${activeJobs.size} scheduled task(s)...`);
  activeJobs.forEach((job, taskKey) => {
    job.stop();
    logger.info(`Task ${taskKey} stopped.`);
  });
  activeJobs.clear();
  logger.info('All scheduled tasks stopped.');
}
