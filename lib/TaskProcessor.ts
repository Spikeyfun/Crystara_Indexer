import { createLogger } from '../app/indexer/utils';
import cron, { ScheduledTask } from 'node-cron';
import { synchronizeDatabases } from './tasks/executeSyncDb';
import { syncAnchorTokensFromSupabaseToSqlite } from './tasks/sync-rules-from-supabase'; // Asegǧrate de que la ruta sea correcta
import { EventPoller } from '@/app/indexer/poller';
import { executeOhlcAggregation1mLocal } from './tasks/executeOhlcAggregation';
import { executeOhlcAggregation5m } from './tasks/executeOhlcAggregation5m';
import { executeOhlcAggregation1h } from './tasks/executeOhlcAggregation1h';
import { executeOhlcAggregation1d } from './tasks/executeOhlcAggregation1d';
import { executeDbCleanup } from './tasks/executeDbCleanup';
import { runFreshnessWatchdog } from './tasks/freshnessWatchdog';
import { runRetryPass } from '@/app/indexer/retryJob';

const logger = createLogger('task-processor');

export interface NetworkConfig {
  rpcUrl: string;
  networkName: string;
}

interface SchedulerSetupConfig {
  testnet?: NetworkConfig;
  mainnet?: NetworkConfig;
}

let activeJobs: Map<string, ScheduledTask> = new Map();

// This function will now only handle the most frequent tasks (every minute)
async function runMinuteCycleForNetwork(networkConfig: NetworkConfig, poller: EventPoller) {
  logger.info(`[${networkConfig.networkName}] Starting 1-minute cycle...`);
  try {
    // Step 1: Sync Pairs/Tokens to Supabase if new data exists
    if (poller.newSqliteDataCreated) {
      logger.info(`[${networkConfig.networkName}] Executing DB Synchronization...`);
      await synchronizeDatabases(networkConfig.networkName, poller);
      logger.info(`[${networkConfig.networkName}] DB Synchronization COMPLETED.`);
      poller.resetNewSqliteDataCreated(); // Reset flag after sync
    } else {
      logger.info(`[${networkConfig.networkName}] Skipping DB Synchronization (no new data).`);
    }

    // Step 2: Aggregate swaps to 1m OHLC locally in SQLite
    logger.info(`[${networkConfig.networkName}] Executing 1m Local OHLC Aggregation...`);
    await executeOhlcAggregation1mLocal(networkConfig.networkName);
    logger.info(`[${networkConfig.networkName}] 1m Local OHLC Aggregation COMPLETED.`);

  } catch (error) {
    logger.error(`[${networkConfig.networkName}] Error during 1-minute cycle:`, error);
  }
}

export async function startScheduledTasks(setupConfig: SchedulerSetupConfig, pollers: Map<string, EventPoller>): Promise<void> {
  if (activeJobs.size > 0) {
    logger.info('Scheduled tasks are already running.');
    return;
  }

  logger.info('Initializing scheduled tasks with new aggregation strategy...');

  // --- Schedule Network-Specific Tasks ---
  const networksToProcess: NetworkConfig[] = [];
  if (setupConfig.testnet) networksToProcess.push(setupConfig.testnet);
  if (setupConfig.mainnet) networksToProcess.push(setupConfig.mainnet);

  try {
    // We sync anchor rules with allSettled so a transient Supabase hiccup at
    // startup can NEVER abort scheduling of the whole pipeline (1m/5m/1h/1d).
    // Anchors only affect canonical token ordering; running "degraded" is far
    // better than a silent full stop of OHLC generation.
    const syncResults = await Promise.allSettled(
      networksToProcess.map(networkConfig =>
        syncAnchorTokensFromSupabaseToSqlite(networkConfig.networkName)
      )
    );
    const syncFailures = syncResults.filter(r => r.status === 'rejected');
    if (syncFailures.length > 0) {
      logger.error(
        `Anchor token rules synchronization FAILED for ${syncFailures.length}/${networksToProcess.length} ` +
        `network(s). Proceeding with scheduled tasks anyway (token ordering may be degraded).`,
        syncFailures.map((r: any) => r.reason)
      );
    } else {
      logger.info('Initial anchor token rules synchronization COMPLETED for all networks.');
    }
  } catch (error) {
    // Defensive: Promise.allSettled should not throw, but never let this block scheduling.
    logger.error('Unexpected error during anchor token rules synchronization. Proceeding with scheduled tasks anyway.', error);
  }

  if (networksToProcess.length === 0) {
    logger.warn('No network configurations provided. No network-specific tasks will be started.');
  } else {
    networksToProcess.forEach(networkConfig => {
      const networkName = networkConfig.networkName;
      const pollerInstance = pollers.get(networkName);

      if (!pollerInstance) {
        logger.error(`CRITICAL: No EventPoller instance for ${networkName}. Skipping task setup.`);
        return;
      }

      const schedules = {
        '1m_cycle': { schedule: '* * * * *', task: () => runMinuteCycleForNetwork(networkConfig, pollerInstance), description: '1-minute local aggregation and DB sync' },
        '5m_agg':   { schedule: '*/5 * * * *', task: () => executeOhlcAggregation5m(networkName), description: '5-minute remote aggregation' },
        '1h_agg':   { schedule: '2 * * * *', task: () => executeOhlcAggregation1h(networkName), description: '1-hour remote aggregation' },
        '1d_agg':   { schedule: '3 0 * * *', task: () => executeOhlcAggregation1d(networkName), description: '1-day remote aggregation' },
      };

      for (const [key, { schedule, task, description }] of Object.entries(schedules)) {
        const taskKey = `${networkName}-${key}`;
        if (!activeJobs.has(taskKey)) {
          logger.info(`Scheduling ${description} for ${networkName} with cron: ${schedule}`);
          const job = cron.schedule(schedule, async () => {
            logger.info(`Triggering ${description} for ${networkName}`);
            await task();
            logger.info(`Finished ${description} for ${networkName}`);
          }, { timezone: "UTC" });
          activeJobs.set(taskKey, job);
        }
      }
    });

    // RETRY PASS GLOBAL (cada 5 min, offset para no chocar con el agregador de 5m):
    // re-procesa eventos fallidos de EventTracking (processed=false) re-fetching
    // solo los rangos de bloques afectados — RPC proporcional a fallos reales.
    const retryTaskKey = 'global-retry_pass';
    if (!activeJobs.has(retryTaskKey)) {
      const job = cron.schedule('7,22,37,52 * * * *', async () => {
        try {
          await runRetryPass();
        } catch (e: any) {
          logger.error(`Retry pass cron failed: ${e.message}`);
        }
      }, { timezone: "UTC" });
      activeJobs.set('global-retry_pass', job);
      logger.info('Scheduling failed-event retry pass with cron: 7,22,37,52 * * * *');
    }
  }

  // --- Freshness watchdog (every 10 min): makes a frozen pipeline VISIBLE ---
  const watchdogTaskKey = 'global-freshness-watchdog';
  if (!activeJobs.has(watchdogTaskKey)) {
    const schedule = '*/10 * * * *';
    logger.info(`Scheduling freshness watchdog with cron: ${schedule}`);
    const job = cron.schedule(schedule, async () => {
      try {
        await runFreshnessWatchdog(networksToProcess.map(n => n.networkName));
      } catch (e: any) {
        logger.error(`Freshness watchdog cron failed: ${e.message}`);
      }
    }, { timezone: "UTC" });
    activeJobs.set(watchdogTaskKey, job);
  }

  // --- Schedule Global Tasks ---
  const cleanupTaskKey = 'global-db-cleanup';
  if (!activeJobs.has(cleanupTaskKey)) {
    const schedule = '5 0 * * *'; // 00:05 UTC daily
    logger.info(`Scheduling DB cleanup with cron: ${schedule}`);
    const job = cron.schedule(schedule, async () => {
      logger.info('Triggering daily DB cleanup...');
      await executeDbCleanup();
      logger.info('Finished daily DB cleanup.');
    }, { timezone: "UTC" });
    activeJobs.set(cleanupTaskKey, job);
  }

  logger.info(`${activeJobs.size} task(s) configured and started.`);
}

export function stopScheduledTasks(): void {
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
