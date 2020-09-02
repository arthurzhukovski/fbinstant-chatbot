if(process.env.NODE_ENV === 'development'){
    require('dotenv').config();
}

const {SchedulerWorker} = require('../core/workers/index');

const iterationIntervalMs = process.env.ITERATION_INTERVAL || 3000;
const workerName = process.env.WORKER_NAME || 'SCHEDULER';
const notificationListName = process.env.NOTIFICATION_QUEUE_LIST_NAME || 'notifications';

const schedulerWorker = new SchedulerWorker(iterationIntervalMs, workerName, notificationListName);
schedulerWorker.run();