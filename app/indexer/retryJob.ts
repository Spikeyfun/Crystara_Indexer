/**
 * retryJob.ts
 *
 * REINTENTO de eventos fallidos (el fix del gap crítico S1).
 *
 * Problema original: un evento cuyo handler o webhook fallaba UNA vez quedaba
 * `processed=false` en EventTracking y NADIE lo reintentaba — el poller avanza
 * el cursor y el evento se perdía permanentemente.
 *
 * Solución estándar: cron de 5 min que:
 *  1. Lee EventTracking `processed=false` (acotado: máx 200 filas más antiguas por pasada).
 *  2. Agrupa fallos por (network, eventType, blockHeight).
 *  3. Re-invoca `fetchBlockEvents` SÓLO sobre los rangos de bloques con fallos
 *     (RPC proporcional a los fallos reales → costo CERO en estado estable).
 *  4. Filtra los eventos reconstruidos contra los fallos exactos (txHash+seq+type)
 *     y re-procesa.
 *
 * La idempotencia ya la garantiza el diseño: el upsert de EventTracking nunca
 * resetea `processed`, así que los eventos que ya tuvieron éxito se saltan
 * (ALREADY_PROCESSED) y solo los fallidos re-ejecutan su handler.
 */

import { sqliteDb } from '@/lib/prismadb';
import { fetchBlockEventsDetailed } from './rpcClient';
import { GAP_MARKER } from './gapLog';
import { RpcEvent } from './types';
import { processEvents } from './eventProcessor';
import { createLogger } from './utils';

const logger = createLogger('retryJob');

const MAX_FAILURES_PER_PASS = 200;
// Debe ser MENOR que el `MAX_BLOCK_RANGE` (100) de rpcClient: ese fetch CLAMPA los
// rangos mayores sin avisar al llamador. Con 90 mantenemos margen para el ±1 que
// añade retryGroup sin cruzar el límite.
const MAX_RANGE_SPAN = 90;

interface FailureRow {
  network: string;
  eventType: string;
  blockHeight: bigint;
  transactionHash: string;
  sequenceNumber: string | null;
}

export async function runRetryPass(): Promise<void> {
  try {
    // VENTANA 24h: los fallos viejos son ruido (token muerto, pool borrada, etc.).
    // Acotar evita re-fetch infinito de bloques perennemente fallidos — el estándar
    // de la industria (un evento vencido se descarta, no se persigue para siempre).
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const failures: any[] = await sqliteDb.eventTracking.findMany({
      where: { processed: false, updatedAt: { gte: twentyFourHoursAgo } },
      orderBy: { blockHeight: 'asc' },
      take: MAX_FAILURES_PER_PASS,
    });

    if (failures.length === 0) return;
    logger.info(`Retry pass: ${failures.length} eventos fallidos encontrados.`);

    // Agrupar por (network): re-fetch por RANGO DE BLOQUES, no por tipo.
    //
    // Por qué NO por tipo: el flujo batch necesita el orden real de ejecución.
    // Un fallo de ProposalCreated (herald) y otro de ProposalExecuted (anchor)
    // del mismo bloque viven en grupos de tipo distintos; re-procesarlos por
    // separado perdía el orden y forzaba varios passes. Re-fetch del bloque
    // completo (todos los tipos) y re-procesar ordenado lo resuelve en uno.
    const groups = new Map<string, FailureGroup>();
    for (const f of failures) {
      if (!f.network || !f.blockHeight) continue; // eventType ya no es requerido
      let g = groups.get(f.network);
      if (!g) {
        g = { network: f.network, blocks: new Set(), gapRanges: [] };
        groups.set(f.network, g);
      }
      g.blocks.add(f.blockHeight.toNumber?.() ?? Number(f.blockHeight));

      // Marcador de hueco: un rango que el poller saltó o cuyo fetch best-effort
      // falló. Se codifica como sequenceNumber "start-end".
      if (f.transactionHash === GAP_MARKER) {
        const m = String(f.sequenceNumber || '').match(/^(\d+)-(\d+)$/);
        if (m) {
          const s = Number(m[1]);
          const e = Number(m[2]);
          if (Number.isFinite(s) && Number.isFinite(e) && e >= s) {
            g.gapRanges.push([s, e]);
          }
        }
      }
    }

    for (const g of groups.values()) {
      try {
        await retryGroup(g);
      } catch (e: any) {
        logger.warn(`Retry group [${g.network}]: ${e.message?.slice(0, 150)}`);
      }
    }
  } catch (e: any) {
    logger.error(`Retry pass failed: ${e.message}`);
  }
}

interface FailureGroup {
  network: string;
  blocks: Set<number>;
  /** Rangos [start, end] de huecos a re-fetchear completos (skip / fallo de fetch). */
  gapRanges: Array<[number, number]>;
}

async function retryGroup(g: FailureGroup): Promise<void> {
  const rpcUrl = g.network === 'supra-mainnet'
    ? (process.env.SUPRA_RPC_URL_MAINNET || 'https://rpc-mainnet.supra.com/rpc/v1')
    : (process.env.SUPRA_RPC_URL_TESTNET || 'https://rpc-testnet.supra.com/rpc/v1');

  // Coalescer blockHeights contiguos (gap ≤ 2) en rangos acotados.
  //
  // IMPORTANTE — `MAX_RANGE_SPAN` no puede superar el `MAX_BLOCK_RANGE` (100) del
  // RPC: `fetchBlockEvents` CLAMPA los rangos mayores sin avisar al llamador, así
  // que pedir 400 devolvía solo los primeros 100 y los 300 restantes se perdían
  // en silencio (el retryJob creía haberlos reprocesado). Por eso cada rango se
  // divide en trozos de `MAX_RANGE_SPAN` antes de pedir nada.
  const sorted = [...g.blocks].sort((a, b) => a - b);
  const ranges: Array<[number, number]> = [];
  if (sorted.length > 0) {
    let start = sorted[0], prev = sorted[0];
    for (let i = 1; i < sorted.length; i++) {
      if (sorted[i] - prev <= 2) { prev = sorted[i]; continue; }
      ranges.push([start, prev]);
      start = prev = sorted[i];
    }
    ranges.push([start, prev]);
  }
  // Huecos: re-fetch del rango completo (no solo bloques sueltos).
  for (const [s, e] of g.gapRanges) ranges.push([s, e]);

  // Trocear TODOS los rangos (normal y de hueco) para no exceder el límite del RPC.
  const safeRanges: Array<[number, number]> = [];
  for (const [s, e] of ranges) {
    for (let cur = s; cur <= e; cur += MAX_RANGE_SPAN) {
      safeRanges.push([cur, Math.min(cur + MAX_RANGE_SPAN - 1, e)]);
    }
  }

  if (safeRanges.length === 0) return;

  let reprocessedEvents: RpcEvent[] = [];
  const bestEffortFailedInRanges: string[] = [];
  for (const [rangeStart, rangeEnd] of safeRanges) {
    // Ampliar el rango ±1 por seguridad de límites del API de eventos
    const s = Math.max(1, rangeStart - 1);
    const e = rangeEnd + 1;
    logger.info(`Retry: re-fetch bloques ${s}-${e} [${g.network}]`);
    const { events, failedBestEffort } = await fetchBlockEventsDetailed(rpcUrl, `retry-${g.network}`, s, e);
    reprocessedEvents.push(...events);
    bestEffortFailedInRanges.push(...failedBestEffort);
    await new Promise(r => setTimeout(r, 300)); // pacing anti-429
  }

  const inGap = (bh: number) => g.gapRanges.some(([s, e]) => bh >= s && bh <= e);

  // Fallos pendientes del grupo: cualquier tipo en los bloques afectados.
  // Acotado al rango para no cargar todos los fallos de la red en cada pass.
  const allBlocks = [...sorted, ...g.gapRanges.flat()];
  const minBlock = BigInt(Math.min(...allBlocks));
  const maxBlock = BigInt(Math.max(...allBlocks));
  const pendingRows = await sqliteDb.eventTracking.findMany({
    where: {
      network: g.network,
      processed: false,
      blockHeight: { gte: minBlock, lte: maxBlock },
    },
    select: { transactionHash: true, sequenceNumber: true, eventType: true },
  });
  const wanted = new Set(
    pendingRows
      .filter(f => f.transactionHash !== GAP_MARKER) // los huecos no son eventos exactos
      .map(f => `${f.transactionHash}|${f.sequenceNumber}|${f.eventType}`)
  );

  // Re-procesar en ORDEN real de ejecución (blockHeight → sequence_number → type).
  // Dentro de un hueco: TODO el rango (no hay "fallo exacto" que filtrar; el
  // processEvents es idempotente, los ya procesados se saltan solos).
  // Fuera de un hueco: SOLO los eventos con fallo registrado (comportamiento previo).
  const matched = reprocessedEvents
    .filter(ev => {
      const bh = Number(ev.blockHeight || 0);
      if (inGap(bh)) return true;
      if (!g.blocks.has(bh)) return false;
      const hash = ev.transactionHash || `unknown_tx_hash_for_${ev.type}_block_${ev.blockHeight}`;
      const seq = ev.sequence_number || `unknown_seq_num_for_${ev.type}_block_${ev.blockHeight}`;
      return wanted.has(`${hash}|${seq}|${ev.type}`);
    })
    .sort((a: any, b: any) => {
      const bh = Number(a.blockHeight || 0) - Number(b.blockHeight || 0);
      if (bh !== 0) return bh;
      const sq = Number(a.sequence_number || 0) - Number(b.sequence_number || 0);
      if (sq !== 0) return sq;
      return String(a.type).localeCompare(String(b.type));
    });

  if (matched.length > 0) {
    logger.info(`Retry: re-procesando ${matched.length} eventos (${g.blocks.size} bloques, ${g.gapRanges.length} huecos) [${g.network}]`);
    await processEvents(matched, null);
  } else {
    logger.info(`Retry: [${g.network}] sin eventos a re-procesar (${reprocessedEvents.length} fetcheados, ${g.gapRanges.length} huecos).`);
  }

  // Cerrar los huecos SOLO si el re-fetch no volvió a fallar en best-effort.
  // Si volvió a fallar, el hueco debe seguir abierto para el próximo pass —
  // cerrarlo aquí lo perdería en silencio.
  if (g.gapRanges.length > 0) {
    if (bestEffortFailedInRanges.length === 0) {
      await sqliteDb.eventTracking.updateMany({
        where: {
          network: g.network,
          transactionHash: GAP_MARKER,
          processed: false,
          blockHeight: { gte: minBlock, lte: maxBlock },
        },
        data: { processed: true, error: null },
      });
      logger.info(`Retry: [${g.network}] ${g.gapRanges.length} hueco(s) cerrados.`);
    } else {
      logger.warn(`Retry: [${g.network}] huecos NO cerrados — el re-fetch volvió a fallar en ${bestEffortFailedInRanges.length} tipo(s).`);
    }
  }

  logger.info(`Retry: pass de [${g.network}] completado.`);
}
