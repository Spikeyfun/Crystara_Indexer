import { sqliteDb, supabaseDb } from '@/lib/prismadb';
import { createLogger } from '@/app/indexer/utils';

const logger = createLogger('freshness-watchdog');

// Primary signal: the poller advances `blockProgress` as it scans blocks, even
// when no swaps happen. If it stops advancing the poller is stuck/dead.
const PROGRESS_STALE_MS =
  parseInt(process.env.WATCHDOG_PROGRESS_STALE_MINUTES || '60', 10) * 60 * 1000;

// Secondary signal: newest produced data (volume-dependent, so generous).
const DATA_STALE_MS =
  parseInt(process.env.WATCHDOG_DATA_STALE_HOURS || '12', 10) * 60 * 60 * 1000;

// Remember the last verdict per check so we alert only on state transitions.
const lastVerdict = new Map<string, boolean>();
// Track the last observed blockProgress per network to detect a stall.
const progressSeen = new Map<string, { height: number; firstSeenAt: number }>();

function ageMs(ts: Date | string | null | undefined): number | null {
  if (!ts) return null;
  return Date.now() - new Date(ts).getTime();
}

function fmtAge(ms: number | null): string {
  if (ms === null) return 'never';
  const m = Math.floor(ms / 60000);
  if (m < 60) return `${m}m`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h${m % 60}m`;
  return `${Math.floor(h / 24)}d${h % 24}h`;
}

async function sendAlert(level: 'warn' | 'error', title: string, details: Record<string, any>) {
  const line = `[watchdog] ${title} ${JSON.stringify(details)}`;
  if (level === 'error') logger.error(line);
  else logger.warn(line);

  const url = process.env.ALERT_WEBHOOK_URL;
  if (!url) return;
  try {
    await fetch(url, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        service: 'amm_indexer',
        level,
        title,
        details,
        ts: new Date().toISOString(),
      }),
    });
  } catch (e: any) {
    logger.error(`Failed to deliver watchdog alert webhook: ${e?.message || e}`);
  }
}

function check(
  key: string,
  unhealthy: boolean,
  title: string,
  details: Record<string, any>,
  level: 'warn' | 'error' = 'error'
) {
  const prevHealthy = lastVerdict.get(key);
  const wasUnhealthy = prevHealthy === false;
  lastVerdict.set(key, !unhealthy);

  if (unhealthy) {
    if (!wasUnhealthy) {
      void sendAlert(level, title, details); // transition to unhealthy (or first run)
    } else {
      logger.error(`[watchdog] ${title} (still down) ${JSON.stringify(details)}`);
    }
  } else if (wasUnhealthy) {
    void sendAlert('warn', `recovered: ${title}`, details);
  }
}

export async function runFreshnessWatchdog(networks: string[] = ['supra-mainnet']): Promise<void> {
  for (const network of networks) {
    try {
      // --- Primary: is the poller advancing? (volume-independent) ---
      const progress = await supabaseDb.blockProgress.findUnique({ where: { network } });
      if (!progress) {
        check(`progress`, true, `No blockProgress row for ${network} (poller never started?)`, { network });
      } else {
        const height = Number(progress.lastBlockHeight);
        const seen = progressSeen.get(network);
        if (!seen || seen.height !== height) {
          progressSeen.set(network, { height, firstSeenAt: Date.now() });
          check(`progress`, false, `blockProgress advancing for ${network}`, { network, lastBlockHeight: height });
        } else {
          const unchangedFor = Date.now() - seen.firstSeenAt;
          check(
            `progress`,
            unchangedFor > PROGRESS_STALE_MS,
            `blockProgress NOT advancing for ${network} (poller stuck/dead)`,
            {
              network,
              lastBlockHeight: height,
              unchangedFor: fmtAge(unchangedFor),
              thresholdMin: PROGRESS_STALE_MS / 60000,
            }
          );
        }
      }

      // --- Observations (logged every run for visibility) ---
      const lastSwap = await sqliteDb.spikeyAmmSwap.findFirst({
        where: { network },
        orderBy: { blockTimestamp: 'desc' },
        select: { blockTimestamp: true },
      });
      const last1m = await sqliteDb.ohlcData.findFirst({
        where: { network, timeframe: '1m' },
        orderBy: { timestamp: 'desc' },
        select: { timestamp: true },
      });
      const last5m = await supabaseDb.ohlcData.findFirst({
        where: { network, timeframe: '5m' },
        orderBy: { timestamp: 'desc' },
        select: { timestamp: true },
      });

      const swapAge = ageMs(lastSwap?.blockTimestamp);
      const age1m = ageMs(last1m?.timestamp);
      const age5m = ageMs(last5m?.timestamp);

      logger.info(
        `[watchdog] ${network} freshness | swaps: ${fmtAge(swapAge)} | 1m: ${fmtAge(age1m)} | 5m: ${fmtAge(age5m)}`
      );

      // --- Secondary: newest 5m OHLC (Supabase) is not absurdly old ---
      check(
        `ohlc5m`,
        age5m === null || age5m > DATA_STALE_MS,
        `No fresh 5m OHLC in Supabase for ${network} (remote aggregation likely broken)`,
        { network, last5mAt: last5m?.timestamp ?? null, age: fmtAge(age5m), thresholdHours: DATA_STALE_MS / 3600000 },
        'warn'
      );
    } catch (e: any) {
      logger.error(`[watchdog] Failed to evaluate ${network}: ${e?.message || e}`);
    }
  }
}
