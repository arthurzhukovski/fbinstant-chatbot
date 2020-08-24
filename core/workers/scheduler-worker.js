const Worker = require('./worker');
const NotificationQueue = require('../services/notification-queue');
const WebhookService = require('../services/webhook-service');
const ITEMS_PER_BATCH_LIMIT = 1000;

class SchedulerWorker extends Worker{
    constructor(intervalInMs, workerName, notificationListName){
        super(intervalInMs, workerName);
        this.mainLoopCallback = this.schedulingLoopIteration;
        this.notificationQueue = new NotificationQueue(process.env.REDIS_HOST, process.env.REDIS_PORT);
        this.notificationQueue.init();
        this.listName = notificationListName;
        this.webhookService = new WebhookService();
    }

    async schedulingLoopIteration(){
        let result = {ok: true, msg: ""};
        if (this.notificationQueue.isUp){
            let messagesToSend;
            try{
                messagesToSend =  await this.fetchMessagesToSend();
                const queuePushResponse = await this.notificationQueue.pushMultiple(this.listName, messagesToSend);
                if (queuePushResponse){
                    result.msg = `Successful push operation on list "${this.listName}". Amount of items: ${messagesToSend.length}`;
                }else{
                    result.ok = false;
                    result.msg = `Failed push operation on list "${this.listName}". Amount of items: ${messagesToSend.length}`;
                }
            }catch(error){
                console.error(error);
            }
        }else{
            result.ok = false;
            result.msg = 'Doing nothing as the queue is down'
        }
        return result;
    }

    async fetchMessagesToSend(){
        return this.webhookService.getWebhooksForSending(ITEMS_PER_BATCH_LIMIT);
    }
}
module.exports = SchedulerWorker;