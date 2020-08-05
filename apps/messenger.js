const {MessengerWorker} = require('../core/workers/index');

const iterationIntervalMs = process.env.ITERATION_INTERVAL || 5000;
const workerName = process.env.WORKER_NAME || 'MESSENGER';
const notificationListName = process.env.NOTIFICATION_QUEUE_LIST_NAME || 'notifications';

const messengerWorker = new MessengerWorker(iterationIntervalMs, workerName, notificationListName);
messengerWorker.run();