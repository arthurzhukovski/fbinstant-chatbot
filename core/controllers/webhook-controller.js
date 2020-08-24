const WebhookService = require('../services/webhook-service');
const ScheduleService = require('../services/schedule-service');
const PlayerService = require('../services/player-service');

class WebhookController {
    constructor(){
        this.webhookService = new WebhookService();
        this.scheduleService = new ScheduleService();
        this.playerService = new PlayerService();
    }
    verify(req, res){
        try{
            if (process.env.BOT_VERIFY_TOKEN){
                const verificationResult = this.webhookService.verifyHook(process.env.BOT_VERIFY_TOKEN, req.query);
                if(verificationResult){
                    res.json(verificationResult);
                }else{
                    res.status(403).json({ok: false, msg: `Access denied`});
                }
            }else{
                console.error('Webhook verification failed: unset environment variable BOT_VERIFY_TOKEN');
                res.status(503).json({ok: false, msg: 'Webhook can\'t be verified at the moment, please try again later'});
            }
        }catch (error) {
            console.error(error);
            return res.status(400).json({ok: false, msg: `Parameter validation failed: ${error}`});
        }
    }

    async createOrUpdate(req, res){
        let webhookData;
        try {
            webhookData = this.webhookService.fetchAndValidateNewWebhookData(req.body);
        }catch (error) {
            res.status(400).json({ok: false, msg: `Input data validation failed: ${error.message}`});
        }
        //todo: determine how to properly connect player with webhook (currently it's assumed that webhookData.playerId equals target player's instantId)
        let player;
        try {
            player = await this.playerService.getPlayer(webhookData.playerId);
        }catch(error){
            console.error(error);
        }
        try{
            const newWebhook = {...webhookData, ...{player: player ? player : null, hookedAt: Date.now(), sentAfterHook: 0, sendAt: this.scheduleService.getDefaultTimeToSendAt(player ? player.tzOffset : 0)}};

            this.webhookService.createOrUpdateWebhook(newWebhook).then(() => {
                res.status(200).end();
            }).catch(error => {
                console.error(`Failed to update webhook data: ${error}`);
                res.status(502).json({ok: false, msg: `Failed to update webhook data`});
            });
        }catch (error) {
            console.error(`Failed to update webhook data: ${error}`);
            res.status(502).json({ok: false, msg: `Failed to update webhook data`});
        }
    }
}

module.exports = WebhookController;