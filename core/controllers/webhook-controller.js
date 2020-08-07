const WebhookService = require('../services/webhook-service');

class WebhookController {
    constructor(){
        this.webhookService = new WebhookService();
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
                console.error(`Webhook verification failed: unset environment variable BOT_VERIFY_TOKEN`);
                res.status(503).json({ok: false, msg: `Webhook can't be verified at the moment, please try again later`});
            }
        }catch (error) {
            console.error(error);
            return res.status(400).json({ok: false, msg: `Parameter validation failed: ${error}`});
        }
    }

    createOrUpdate(req, res){
        //todo implement method
        res.json('Not implemented');
    }
}

module.exports = WebhookController;