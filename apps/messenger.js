const {MessengerWorker} = require('../core/workers/index');

const iterationIntervalMs = process.env.ITERATION_INTERVAL || 5000;
const workerName = process.env.WORKER_NAME || 'MESSENGER';

const messengerWorker = new MessengerWorker(iterationIntervalMs, workerName);
messengerWorker.run();