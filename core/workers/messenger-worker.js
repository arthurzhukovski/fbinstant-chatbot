const Worker = require('./worker');
const NotificationQueue = require('../services/notification-queue');

class MessengerWorker extends Worker{
    constructor(intervalInMs, workerName, notificationListName){
        super(intervalInMs, workerName);
        this.mainLoopCallback = this.messagingLoopIteration;
        this.notificationQueue = new NotificationQueue(process.env.REDIS_HOST, process.env.REDIS_PORT);
        this.notificationQueue.init();
        this.listName = notificationListName;
    }

    async messagingLoopIteration(){
        let result = {ok: true, message: ""};
        if (this.notificationQueue.isUp){
            const messageObjectFromQueue = await this.notificationQueue.pop(this.listName);
            if (messageObjectFromQueue){
                result.message = `Successfully popped ${JSON.stringify(messageObjectFromQueue)} from list "${this.listName}"`;
            }else{
                result.message = false;
            }
        }else{
            result.ok = false;
            result.message = 'Doing nothing as the queue is down'
        }
        return result;
    }
}
module.exports = MessengerWorker;