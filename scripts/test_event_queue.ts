import * as assert from 'assert';
import { EventQueue } from '../app/indexer/eventQueue';

async function testEventQueue() {
  console.log('--- Testing EventQueue Concurrency & Serialization ---');
  const queue = EventQueue.getInstance();

  const executionOrder: number[] = [];
  let concurrentExecutions = 0;
  let maxConcurrencySeen = 0;

  const runTask = (id: number, delayMs: number) => {
    return queue.enqueue(async () => {
      concurrentExecutions++;
      if (concurrentExecutions > maxConcurrencySeen) {
        maxConcurrencySeen = concurrentExecutions;
      }

      await new Promise((resolve) => setTimeout(resolve, delayMs));
      executionOrder.push(id);
      concurrentExecutions--;
      return `result-${id}`;
    });
  };

  // Launch 5 tasks simultaneously with varying delays
  const p1 = runTask(1, 40);
  const p2 = runTask(2, 10);
  const p3 = runTask(3, 30);
  const p4 = runTask(4, 5);
  const p5 = runTask(5, 20);

  const results = await Promise.all([p1, p2, p3, p4, p5]);

  assert.deepStrictEqual(
    results,
    ['result-1', 'result-2', 'result-3', 'result-4', 'result-5'],
    'All promises must resolve with correct values'
  );

  assert.strictEqual(
    maxConcurrencySeen,
    1,
    `Max concurrency must strictly be 1 (was ${maxConcurrencySeen})`
  );

  assert.deepStrictEqual(
    executionOrder,
    [1, 2, 3, 4, 5],
    'Tasks must execute strictly in FIFO sequential order'
  );

  console.log('✅ Sequential FIFO execution verified (concurrency strictly = 1)');

  // Test error handling does not block subsequent queue items
  console.log('--- Testing Queue Error Isolation ---');
  let item6Ran = false;

  const failedTask = queue.enqueue(async () => {
    throw new Error('SIMULATED_FAILURE');
  });

  const nextTask = queue.enqueue(async () => {
    item6Ran = true;
    return 'recovered';
  });

  await assert.rejects(failedTask, /SIMULATED_FAILURE/, 'Failed task must reject');
  const resNext = await nextTask;
  assert.strictEqual(resNext, 'recovered');
  assert.strictEqual(item6Ran, true, 'Subsequent task must execute even if previous failed');

  console.log('✅ Error isolation verified (queue continues cleanly after failure)');
  console.log('🎉 All EventQueue tests passed successfully!');
}

testEventQueue().catch((err) => {
  console.error('❌ Test failed:', err);
  process.exit(1);
});
