const Worker = require('./worker');
const NotificationQueue = require('../services/notification-queue');
const ITEMS_PER_BATCH_LIMIT = 1;

class MessengerWorker extends Worker{
    constructor(intervalInMs, workerName, notificationListName){
        super(intervalInMs, workerName);
        this.mainLoopCallback = this.messagingLoopIteration;
        this.notificationQueue = new NotificationQueue(process.env.REDIS_HOST, process.env.REDIS_PORT);
        this.notificationQueue.init();
        this.listName = notificationListName;
    }

    async messagingLoopIteration(){
        let result = {ok: true, msg: ""};
        if (this.notificationQueue.isUp){
            const messageObjectFromQueue = await this.notificationQueue.pop(this.listName);
            if (messageObjectFromQueue){
                result.msg = `Successfully popped ${messageObjectFromQueue.senderId} from list "${this.listName}"`;
            }else{
                result.msg = false;
            }
        }else{
            result.ok = false;
            result.msg = 'Doing nothing as the queue is down';
        }
        return result;
    }
}
module.exports = MessengerWorker;