import { createLogger } from '../app/indexer/utils';
import cron, { ScheduledTask } from 'node-cron';
import { executeOhlcAggregation } from './tasks/executeOhlcAggregation';
import { synchronizeDatabases } from './tasks/executeSyncDb';
import { EventPoller } from '@/app/indexer/poller';

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

async function runUpdateCycleForNetwork(networkConfig: NetworkConfig, poller: EventPoller) {
  logger.info(`[${networkConfig.networkName}] Starting update cycle...`);
  try {
    // Paso 1: Sincronizar DBs (solo si hay nuevos datos en SQLite)
    if (poller.newSqliteDataCreated) {
      logger.info(`[${networkConfig.networkName}] Executing DB Synchronization (new data detected)...`);
      await synchronizeDatabases(networkConfig.networkName, poller);
      logger.info(`[${networkConfig.networkName}] DB Synchronization COMPLETED.`);
    } else {
      logger.info(`[${networkConfig.networkName}] Skipping DB Synchronization (no new data in SQLite).`);
    }

    // Paso 2: Agregar OHLC (solo si hay nuevos datos en SQLite o si ya hay pares en Supabase)
    // La agregación OHLC depende de los pares en Supabase, no directamente de los swaps en SQLite.
    // Si no hay nuevos datos en SQLite, pero ya hay pares en Supabase, la agregación debe seguir ejecutándose.
    logger.info(`[${networkConfig.networkName}] Executing OHLC Aggregation...`);
    await executeOhlcAggregation(networkConfig.networkName);
    logger.info(`[${networkConfig.networkName}] OHLC Aggregation COMPLETED.`);

    // Resetear el flag después de un ciclo completo
    poller.resetNewSqliteDataCreated();

    logger.info(`[${networkConfig.networkName}] Update cycle finished successfully.`);
  } catch (error) {
    logger.error(`[${networkConfig.networkName}] Error during update cycle:`, error);
  }
}

export function startScheduledTasks(setupConfig: SchedulerSetupConfig, pollers: Map<string, EventPoller>): void {
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
    const pollerInstance = pollers.get(networkConfig.networkName);

    if (!pollerInstance) {
      logger.error(`CRITICAL: No EventPoller instance found for network ${networkConfig.networkName}. Skipping task setup.`);
      return;
    }

    if (!activeJobs.has(masterUpdateTaskKey)) {
      logger.info(`Setting up OHLC Aggregation task for ${networkConfig.networkName}`);

      // Ejecutar cada minuto.
      const schedule = '* * * * *';

      const job: ScheduledTask = cron.schedule(schedule, async () => {
        logger.info(`Triggering OHLC Aggregation for ${networkConfig.networkName} (cron: ${schedule})`);
        await runUpdateCycleForNetwork(networkConfig, pollerInstance);
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
