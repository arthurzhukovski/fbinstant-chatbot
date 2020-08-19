const Webhook = require('../models/webhook');
const ParameterFetcher = require('../utils/parameter-fetcher');

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

    createOrUpdateWebhook(newFieldValues){
        //todo: find out which field should be the primary key
        return Webhook.updateOne({ senderId: newFieldValues.senderId }, newFieldValues, { upsert: true, setDefaultsOnInsert: true });
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
                        } else
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
}

module.exports = WebhookService;