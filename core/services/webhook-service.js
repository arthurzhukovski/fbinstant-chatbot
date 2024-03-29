const Webhook = require('../models/webhook');
const Player = require('../models/player');

class WebhookService{

    verifyHook(verificationToken, params){
        if (params){
            let mode = params['hub.mode'];
            let clientToken = params['hub.verify_token'];
            let challenge = params['hub.challenge'];

            if (mode && clientToken) {
                return mode === 'subscribe' && clientToken === verificationToken ? challenge : false;
            }else{
                const emptyParam = !mode ? 'mode' : 'token';
                throw new Error(`Empty parameter ${emptyParam}`);
            }
        }else{
            throw new Error(`No required parameters were provided`);
        }
    }

    getWebhooksForSending(limit, dateObjectToFilter = new Date()){
        return Webhook.find({isInQueue: false, sendAt: {$lte: dateObjectToFilter.getTime()}, player: {$ne: null}}).limit(limit).populate('player');
    }

    createOrUpdateWebhook(newFieldValues){
        return Webhook.updateOne({ playerId: newFieldValues.playerId }, newFieldValues, { upsert: true, setDefaultsOnInsert: true });
    }

    fetchAndValidateNewWebhookData(rawData){
        if (rawData.object.toLowerCase() === 'page'){
            if (Array.isArray(rawData.entry)){
                const targetEntry = rawData.entry[0];
                if(Array.isArray(targetEntry.messaging)){
                    const targetMessaging = targetEntry.messaging[0];
                    const senderId = targetMessaging.sender.id;
                    if(typeof senderId === 'string' && senderId){
                        let targetObject;
                        if (targetMessaging.game_play){
                            targetObject = targetMessaging.game_play;
                        }else if (targetMessaging.message){
                            targetObject = targetMessaging.message;
                        }else
                            throw new Error('Neither "game_play" nor "message" were provided');

                        if (typeof targetObject.player_id === 'string' && targetObject.player_id){
                            return {
                                senderId: senderId,
                                playerId: targetObject.player_id,
                                contextId: targetObject.context_id,
                            }
                        }else
                            throw new Error('Field "player_id" must be non-empty string');

                    }else
                        throw new Error('Field "sender"."id" must be non-empty string');
                }else
                    throw new Error('Field "entry"."messaging" must be an array');
            }else
                throw new Error('Field "entry" must be an array');
        }else
            throw new Error('Field "object" must contain value "page"');
    }

    setInQueueStatus(webhooks, status){
        const whPromises = webhooks.map(async wh => {
            return Webhook.updateOne({playerId: wh.playerId}, {isInQueue: status});
        });
        return Promise.all(whPromises);
    }

    async processWebhookAfterSendingPlayerMessage(webhook, scheduleService){
        const webhookFromDb = await Webhook.findOne({playerId: webhook.playerId});
        if (webhookFromDb.hookedAt.toString() === webhook.hookedAt.toString()){
            const amountOfSentMessages = webhook.sentAfterHook + 1;
            if (amountOfSentMessages >= scheduleService.schedule.length){
                return this.deleteWebhook(webhook.playerId);
            }else{
                const tzOffset = webhook.player ? webhook.player.tzOffset : 0;
                webhookFromDb.sentAfterHook = amountOfSentMessages;
                webhookFromDb.sendAt = scheduleService.getTimeToSendAt(amountOfSentMessages, tzOffset, webhookFromDb.hookedAt.getTime());
                return webhookFromDb.save();
            }
        }else{
            console.log('Webhook has been updated while being in a queue');
            return false;
        }
    }

    deleteWebhook(playerId){
        return Webhook.deleteOne({playerId: playerId});
    }
}

module.exports = WebhookService;