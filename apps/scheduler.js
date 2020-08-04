const {SchedulerWorker} = require('../core/workers/index');

const iterationIntervalMs = process.env.ITERATION_INTERVAL || 3000;
const workerName = process.env.WORKER_NAME || 'SCHEDULER';

const schedulerWorker = new SchedulerWorker(iterationIntervalMs, workerName);
schedulerWorker.run();