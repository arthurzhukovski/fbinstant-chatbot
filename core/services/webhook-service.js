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
}

module.exports = WebhookService;