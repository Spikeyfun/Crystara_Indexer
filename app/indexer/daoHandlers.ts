import { createLogger } from './utils';
import { RpcEvent } from './types';

const logger = createLogger('daoHandlers');

// Obtenemos la URL del webhook desde el entorno o usamos un fallback a localhost para pruebas
const DAO_WEBHOOK_URL = process.env.DAO_WEBHOOK_URL || 'http://localhost:3000/api/indexer/webhook';
const DAO_WEBHOOK_SECRET = process.env.DAO_WEBHOOK_SECRET || 'hoglet_dao_prod_v1_88a91f42b3c1d9e7';

/**
 * Procesa los eventos de alto impacto de la DAO y los envía al backend Next.js vía Webhook.
 * @param event El evento crudo capturado del blockchain
 * @param tx La transacción local de Prisma (usada si necesitamos anotar algo extra localmente, aunque aquí solo hacemos POST)
 * @returns boolean indicando si se procesó (creó data)
 */
export async function handleDaoEvent(event: RpcEvent, tx: any): Promise<boolean> {
  logger.debug(`Dispatching DAO event ${event.type} to webhook at ${DAO_WEBHOOK_URL}`);

  try {
    const response = await fetch(DAO_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-webhook-secret': DAO_WEBHOOK_SECRET
      },
      body: JSON.stringify(event),
    });

    if (!response.ok) {
      const errorText = await response.text();
      logger.error(`Webhook failed for event ${event.type}: Status ${response.status} - ${errorText}`);
      throw new Error(`Webhook failed: ${response.status} ${response.statusText}`);
    }

    logger.info(`Successfully dispatched DAO event ${event.type} to webhook.`);
    return true; // Retornamos true para indicar que la data fue procesada exitosamente
  } catch (error) {
    logger.error(`Error dispatching DAO event ${event.type} to webhook:`, error);
    throw error; // Lanzamos el error para que eventProcessor no lo marque como completado y reintente
  }
}

/**
 * Envía un LOTE de eventos DAO en un único POST al webhook ({ events: [...] }).
 *
 * Por qué: un bloque puede traer decenas de eventos (advance_epoch + N Voted +
 * LockCreated...). Enviarlos uno a uno era N round-trips HTTP serializados y N
 * invocaciones del Worker, agravando el SQLITE_BUSY de D1 (que serializa
 * writes). Un solo POST con el array ordenado elimina la amplificación.
 *
 * Orden: el caller ya ordena por (blockHeight, sequence_number). Se preserva
 * para que los eventos de creación precedan a sus dependientes.
 *
 * Reintento: si el webhook responde 503 (RetryableEventError), el lote completo
 * se considera fallido → el eventProcessor NO marca processed y el retryJob lo
 * re-procesa. Mismo contrato que el modo single.
 */
export async function handleDaoEventBatch(events: RpcEvent[]): Promise<boolean> {
  if (events.length === 0) return false;

  logger.debug(`Dispatching BATCH of ${events.length} DAO events to webhook at ${DAO_WEBHOOK_URL}`);

  const response = await fetch(DAO_WEBHOOK_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-webhook-secret': DAO_WEBHOOK_SECRET,
    },
    body: JSON.stringify({ events }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    logger.error(`Webhook BATCH failed (${events.length} events): Status ${response.status} - ${errorText}`);
    throw new Error(`Webhook batch failed: ${response.status} ${response.statusText}`);
  }

  logger.info(`Successfully dispatched BATCH of ${events.length} DAO events to webhook.`);
  return true;
}
