import { sqliteDb } from '@/lib/prismadb';
import { createLogger } from './utils';

const logger = createLogger('gapLog');

/**
 * Marcador de "hueco" en EventTracking.
 *
 * Un hueco es un rango de bloques cuyos eventos NO quedaron procesados por una
 * razón que NO deja fila propia:
 *   - el poller saltó el rango (noteBatchFailure) para no quedarse atascado, o
 *   - un tipo de evento "best-effort" (DAO) agotó sus reintentos de fetch.
 *
 * Antes esos casos se perdían en silencio: EventTracking solo registra eventos
 * que SÍ se fetchearon y fallaron al procesar, así que un fallo de fetch no
 * dejaba rastro y el retryJob no tenía nada que reintentar.
 *
 * Se reutiliza EventTracking (en vez de una tabla nueva) para no requerir
 * migración: la tabla ya es duradera y el retryJob ya la recorre.
 */
export const GAP_MARKER = '__GAP__';

/**
 * Registra un rango de bloques como hueco a reproducir.
 * Idempotente: re-registrar el mismo rango solo actualiza el motivo y re-abre el
 * hueco (processed=false) por si un intento previo lo había cerrado.
 */
export async function recordEventGap(
    network: string,
    startBlock: number,
    endBlock: number,
    reason: string
): Promise<void> {
    if (!Number.isFinite(startBlock) || !Number.isFinite(endBlock)) return;
    const sequenceNumber = `${startBlock}-${endBlock}`;
    try {
        await sqliteDb.eventTracking.upsert({
            where: {
                network_transactionHash_sequenceNumber_eventType: {
                    network,
                    transactionHash: GAP_MARKER,
                    sequenceNumber,
                    eventType: GAP_MARKER,
                },
            },
            create: {
                network,
                eventType: GAP_MARKER,
                transactionHash: GAP_MARKER,
                sequenceNumber,
                blockHeight: BigInt(startBlock),
                processed: false,
                error: reason.slice(0, 1000),
            },
            update: {
                processed: false,
                error: reason.slice(0, 1000),
                // EventTracking no tiene @updatedAt: se refresca a mano para que
                // un hueco que sigue fallando no expire de la ventana de 24h del
                // retryJob mientras hay actividad.
                updatedAt: new Date(),
            },
        });
        logger.warn(`[gap] Rango ${startBlock}-${endBlock} registrado para replay [${network}]: ${reason.slice(0, 120)}`);
    } catch (e: any) {
        logger.error(`[gap] No se pudo registrar el rango ${startBlock}-${endBlock}: ${e.message}`);
    }
}
