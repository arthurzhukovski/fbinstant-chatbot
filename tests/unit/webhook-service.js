require('dotenv').config();
const assert = require('chai').assert;
const WebhookService = require('../../core/services/webhook-service');

describe('WebhookService', function () {
    const webhookService = new WebhookService();

    it('WebhookService.verifyHook should return the same value as stored in "hub.challenge"', function () {
        const params = {
            'hub.mode':'subscribe',
            'hub.verify_token':'fancytoken',
            'hub.challenge':'this is challenge'
        };
        const res = webhookService.verifyHook('fancytoken', params);
        assert.equal(res, 'this is challenge')
    });

    const webhookUpdateParams = {
        "object": "page",
        "entry": [
            {
                "messaging":[
                    {
                        "sender":{
                            "id":"test_sender_id"
                        },
                        "game_play": {
                            "player_id": "test_instant_id",
                            "context_id": "test_context_id"
                        }
                    }
                ]
            }
        ]
    };

    it('WebhookService.fetchAndValidateNewWebhookData should return a value of type object', function () {
        const res = webhookService.fetchAndValidateNewWebhookData(webhookUpdateParams);
        assert.typeOf(res, 'object')
    });

    it('WebhookService.fetchAndValidateNewWebhookData return value should have a field senderId of type string with value "test_sender_id"', function () {
        const res = webhookService.fetchAndValidateNewWebhookData(webhookUpdateParams);
        assert.typeOf(res.senderId, 'string');
        assert.equal(res.senderId, 'test_sender_id');
    });

    it('WebhookService.fetchAndValidateNewWebhookData return value should have a field playerId of type string with value "test_instant_id"', function () {
        const res = webhookService.fetchAndValidateNewWebhookData(webhookUpdateParams);
        assert.typeOf(res.playerId, 'string');
        assert.equal(res.playerId, 'test_instant_id');
    });

    it('WebhookService.fetchAndValidateNewWebhookData throw an error with a certain message (incorrect object)', function () {
        webhookUpdateParams.object = 'some_incorrect_value';
        try {
            const res = webhookService.fetchAndValidateNewWebhookData(webhookUpdateParams);
        }catch (error) {
            assert.equal(error.message, 'Field "object" must contain value "page"')
        }
    });

    it('WebhookService.fetchAndValidateNewWebhookData throw an error with a certain message (incorrect entry)', function () {
        webhookUpdateParams.object = 'page';
        webhookUpdateParams.entry = {};
        try {
            const res = webhookService.fetchAndValidateNewWebhookData(webhookUpdateParams);
        }catch (error) {
            assert.equal(error.message, 'Field "entry" must be an array')
        }
    });

    this.timeout(5000);
    it('WebhookService.getWebhooksForSending with parameter "limit" = 4 should return array with 4 items and its first value sendDate timestamp should be below current timestamp', function () {
        const limit = 4;
        const currentDate = new Date();
        return webhookService.getWebhooksForSending(limit, currentDate).then(result => {
            assert.equal(result.length, limit);
            assert.isAtMost(result[0].sendAt.getTime(), currentDate.getTime());
        });
    });

    it('WebhookService.getWebhooksForSending return value should contain field "locale" of type string', function () {
        const limit = 1;
        const currentDate = new Date();
        return webhookService.getWebhooksForSending(limit, currentDate).then(result => {
            assert.typeOf(result[0].player.locale, 'string');
        });
    });

    it('WebhookService.getWebhooksForSending return value should contain field "tzOffset" of type string', function () {
        const limit = 1;
        const currentDate = new Date();
        return webhookService.getWebhooksForSending(limit, currentDate).then(result => {
            assert.typeOf(result[0].player.tzOffset, 'number');
        });
    });


});