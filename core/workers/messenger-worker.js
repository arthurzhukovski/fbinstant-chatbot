const Worker = require('./worker');
const NotificationQueue = require('../services/notification-queue');
const WebhookService = require('../services/webhook-service');
const MessagingService = require('../services/messaging-service');
const ScheduleService = require('../services/schedule-service');
const TelegramService = require('../services/telegram-service');

const ITEMS_PER_BATCH_LIMIT = 1;
const MS_IN_5_MIN =  5 * 60 * 1000;

class MessengerWorker extends Worker{
    constructor(intervalInMs, workerName, notificationListName){
        super(intervalInMs, workerName);
        this.maxQueueLength = process.env.MAX_QUEUE_LENGTH || 2000;
        this.mainLoopCallback = this.messagingLoopIteration;
        this.notificationQueue = new NotificationQueue(process.env.REDIS_HOST, process.env.REDIS_PORT);
        this.notificationQueue.init();
        this.listName = notificationListName;
        this.lastWarningSentAt = 0;
        this.warningIntervalMs = MS_IN_5_MIN;

        this.webhookService = new WebhookService();
        this.messagingService = new MessagingService();
        this.scheduleService = new ScheduleService();
        this.telegramService = new TelegramService();
        this.telegramService.run();
    }

    async messagingLoopIteration(){
        let result = {ok: true, msg: ""};
        if (this.notificationQueue.isUp){
            this.updateQueueLengthForNotificationBot();

            const messageObjectFromQueue = await this.notificationQueue.pop(this.listName);
            if (messageObjectFromQueue){
                try{
                    await this.messagingService.sendPlayerMessage(messageObjectFromQueue);
                    result.msg = `Successfully sent message for player ${messageObjectFromQueue.playerId}`;
                    await this.webhookService.processWebhookAfterSendingPlayerMessage(messageObjectFromQueue.webhook, this.scheduleService).catch(error => {
                        console.error(`Failed to update webhook fields after sending a message for player with id ${messageObjectFromQueue.playerId}: ${error}`);
                    });
                }catch (error) {
                    result.ok = false;
                    result.msg = `Failed to send message for player ${messageObjectFromQueue.playerId}: ${error}`;
                }finally {
                    this.webhookService.setInQueueStatus([messageObjectFromQueue.webhook], false).catch(error => {
                        console.error(`Failed to update "in queue" status of a webhook for player with id ${messageObjectFromQueue.playerId}: ${error}`);
                    });
                }
            }else{
                result.msg = false;
            }
        }else{
            result.ok = false;
            result.msg = 'Doing nothing as the queue is down';
        }
        return result;
    }

    updateQueueLengthForNotificationBot(){
        this.notificationQueue.llenWithPromise('notifications').then(queueLength => {
            this.telegramService.setSystemMetaInfo('queueLength', queueLength);
            const warningTimeoutExceeded = Date.now() - this.lastWarningSentAt  > this.warningIntervalMs;
            if (parseInt(queueLength) > this.maxQueueLength && warningTimeoutExceeded){
                this.lastWarningSentAt = Date.now();
                this.telegramService.sendWarning(`Redis queue is too long (${queueLength}/${this.maxQueueLength})!`);
            }
        });
    }
}
module.exports = MessengerWorker;