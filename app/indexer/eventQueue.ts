import { createLogger } from './utils';

const logger = createLogger('eventQueue');

interface QueueItem<T> {
  task: () => Promise<T>;
  resolve: (value: T) => void;
  reject: (reason?: any) => void;
  retries: number;
}

export class EventQueue {
  private static instance: EventQueue;
  private queue: QueueItem<any>[] = [];
  private processing: boolean = false;
  private maxRetries: number = 4;
  private baseDelayMs: number = 100;

  private constructor() {}

  public static getInstance(): EventQueue {
    if (!EventQueue.instance) {
      EventQueue.instance = new EventQueue();
    }
    return EventQueue.instance;
  }

  /**
   * Enqueue an async database operation to be executed sequentially.
   */
  public enqueue<T>(task: () => Promise<T>): Promise<T> {
    return new Promise<T>((resolve, reject) => {
      this.queue.push({
        task,
        resolve,
        reject,
        retries: 0,
      });

      if (this.queue.length > 50) {
        logger.warn(`SQLite write queue size is high: ${this.queue.length} pending batches`);
      }

      this.processNext();
    });
  }

  public getQueueLength(): number {
    return this.queue.length;
  }

  public isBusy(): boolean {
    return this.processing;
  }

  private async processNext(): Promise<void> {
    if (this.processing || this.queue.length === 0) {
      return;
    }

    this.processing = true;
    const item = this.queue.shift();

    if (!item) {
      this.processing = false;
      return;
    }

    try {
      const result = await item.task();
      item.resolve(result);
    } catch (error: any) {
      const errorMsg = String(error?.message || error || '');
      const isSqliteLock = 
        errorMsg.includes('SQLITE_BUSY') || 
        errorMsg.includes('database is locked') ||
        error?.code === 'P2034' || // Prisma transaction lock conflict
        error?.code === 'P2028';   // Prisma transaction API error

      if (isSqliteLock && item.retries < this.maxRetries) {
        item.retries += 1;
        const delay = this.baseDelayMs * Math.pow(2, item.retries - 1) + Math.random() * 50;
        logger.warn(
          `SQLite busy/lock detected on batch execution. Retrying attempt ${item.retries}/${this.maxRetries} after ${delay.toFixed(0)}ms...`
        );
        // Put back at the front of the queue to maintain ordering
        this.queue.unshift(item);
        await new Promise((resolve) => setTimeout(resolve, delay));
      } else {
        item.reject(error);
      }
    } finally {
      this.processing = false;
      // Continue draining queue
      if (this.queue.length > 0) {
        setImmediate(() => this.processNext());
      }
    }
  }
}

export const eventQueue = EventQueue.getInstance();
