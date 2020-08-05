const Worker = require('./worker');
const NotificationQueue = require('../services/notification-queue');

class SchedulerWorker extends Worker{
    constructor(intervalInMs, workerName, notificationListName){
        super(intervalInMs, workerName);
        this.mainLoopCallback = this.schedulingLoopIteration;
        this.notificationQueue = new NotificationQueue(process.env.REDIS_HOST, process.env.REDIS_PORT);
        this.listName = notificationListName;
    }

    async schedulingLoopIteration(){
        let result = {ok: true, message: ""};
        if (this.notificationQueue.isUp){
            const messageToSend = {name: "Test", dt: Date.now()};
            const queuePushResponse = await this.notificationQueue.push(this.listName, messageToSend);
            if (queuePushResponse){
                result.message = `Successful push operation on list "${this.listName}". Amount of items: ${queuePushResponse}. Pushed item: ${JSON.stringify(messageToSend)}`;
            }else{
                result.ok = false;
                result.message = `Failed push operation on list "${this.listName}". Failed item: ${JSON.stringify(messageToSend)}`;
            }
        }else{
            result.ok = false;
            result.message = 'Doing nothing as the queue is down'
        }
        return result;
    }
}
module.exports = SchedulerWorker;