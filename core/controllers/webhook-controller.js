const WebhookService = require('../services/webhook-service');
const ScheduleService = require('../services/schedule-service');

class WebhookController {
    constructor(){
        this.webhookService = new WebhookService();
        this.scheduleService = new ScheduleService();
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

    createOrUpdate(req, res){
        let webhookData;
        try {
            webhookData = this.webhookService.fetchAndValidateNewWebhookData(req.body);
        }catch (error) {
            res.status(400).json({ok: false, msg: `Input data validation failed: ${error.message}`});
        }
        const newWebhook = {...webhookData, ...{hookedAt: Date.now(), sentAfterHook: 0, sendAt: this.scheduleService.getDefaultTimeToSendAt()}};
        this.webhookService.createOrUpdateWebhook(newWebhook).then(() => {
            res.status(200).end();
        }).catch(error => {
            console.error(`Failed to update webhook data: ${error}`);
            res.status(502).json({ok: false, msg: `Failed to update webhook data`});
        });
    }
}

module.exports = WebhookController;