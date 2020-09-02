require('dotenv').config();
const assert = require('chai').assert;
const Webhook = require('../../core/models/webhook');
const WebhookService = require('../../core/services/webhook-service');
const PlayerService = require('../../core/services/player-service');
const ScheduleService = require('../../core/services/schedule-service');

describe('WebhookService', function () {
    const webhookService = new WebhookService();
    const playerService = new PlayerService();
    const scheduleService = new ScheduleService();
    const amountOfPlayers = 6;

    it('WebhookService.verifyHook should return the same value as stored in "hub.challenge"', function () {
        const params = {
            'hub.mode':'subscribe',
            'hub.verify_token':'fancytoken',
            'hub.challenge':'this is challenge'
        };
        const res = webhookService.verifyHook('fancytoken', params);
        assert.equal(res, 'this is challenge')
    });

    const baseWebhookFields = {
        "object": "page",
        "entry": [
            {
                "messaging":[
                    {
                        "sender":{
                            "id":"test_sender_id_"
                        },
                        "game_play": {
                            "player_id": "test_id_",
                            "context_id": "test_context_id_"
                        }
                    }
                ]
            }
        ]
    };

    it('WebhookService.fetchAndValidateNewWebhookData should return a value of type object', function () {
        const res = webhookService.fetchAndValidateNewWebhookData(baseWebhookFields);
        assert.typeOf(res, 'object')
    });

    it('WebhookService.fetchAndValidateNewWebhookData return value should have a field senderId of type string with value "test_sender_id"', function () {
        const res = webhookService.fetchAndValidateNewWebhookData(baseWebhookFields);
        assert.typeOf(res.senderId, 'string');
        assert.equal(res.senderId, 'test_sender_id_');
    });

    it('WebhookService.fetchAndValidateNewWebhookData return value should have a field playerId of type string with value "test_instant_id"', function () {
        const res = webhookService.fetchAndValidateNewWebhookData(baseWebhookFields);
        assert.typeOf(res.playerId, 'string');
        assert.equal(res.playerId, 'test_id_');
    });

    it('WebhookService.fetchAndValidateNewWebhookData should throw an error with a certain message (incorrect object)', function () {
        let newWebhook = JSON.parse(JSON.stringify(baseWebhookFields));
        newWebhook.object = 'some_incorrect_value';
        try {
            const res = webhookService.fetchAndValidateNewWebhookData(baseWebhookFields);
        }catch (error) {
            assert.equal(error.message, 'Field "object" must contain value "page"')
        }
    });

    it('WebhookService.fetchAndValidateNewWebhookData should throw an error with a certain message (incorrect entry)', function () {
        let newWebhook = JSON.parse(JSON.stringify(baseWebhookFields));
        newWebhook.object = 'page';
        newWebhook.entry = {};
        try {
            const res = webhookService.fetchAndValidateNewWebhookData(newWebhook);
        }catch (error) {
            assert.equal(error.message, 'Field "entry" must be an array')
        }
    });

    it('WebhookService.createOrUpdateWebhook() called multiple times should return a valid response', async function () {
        for (let i = 1; i <= amountOfPlayers; i++){
            let newWebhookFieldsFromClient = await webhookService.fetchAndValidateNewWebhookData(JSON.parse(JSON.stringify(baseWebhookFields)));
            newWebhookFieldsFromClient.senderId += i;
            newWebhookFieldsFromClient.playerId += i;
            newWebhookFieldsFromClient.contextId += i;

            let player = await playerService.getPlayer(newWebhookFieldsFromClient.playerId);
            let currentDate = new Date();
            let newWebhook = {...newWebhookFieldsFromClient, ...{isInQueue: false, player: player ? player : null, hookedAt: Date.now(), sentAfterHook: 0, sendAt: currentDate.setHours(currentDate.getHours() - 1)} };

            let result = await webhookService.createOrUpdateWebhook(newWebhook);

            assert.equal(result.ok, 1);
            assert.equal(result.n, 1);
        }
    });

    it('WebhookService.getWebhooksForSending with parameter "limit" = 4 should return array with 4 items and its first value sendDate timestamp should be below current timestamp', async function () {
        const limit = 4;
        const currentDate = new Date();
        const result = await webhookService.getWebhooksForSending(limit, currentDate);
        assert.equal(result.length, limit);
        assert.isAtMost(result[0].sendAt.getTime(), currentDate.getTime());
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

    it('WebhookService.deleteOne should delete record from db and return an object with field "deletedCount" equal to 1', function () {
        return webhookService.deleteWebhook(`test_id_${amountOfPlayers}`).then(result => {
            assert.equal(result.deletedCount, 1);
        });
    });

    it('WebhookService.processWebhookAfterSendingPlayerMessage for webhook with a correct value of "hookedAt" and correct value of "sentAfterHook" should return a webhook object with the same value of "playerId"', async function () {
        const playedId = 'test_id_1';
        const newWebhook = await Webhook.findOne({playerId: playedId});

        return webhookService.processWebhookAfterSendingPlayerMessage(newWebhook, scheduleService).then(result => {
            assert.typeOf(result, 'object');
            assert.equal(result.playerId, playedId);
        });
    });

    it('WebhookService.processWebhookAfterSendingPlayerMessage for webhook with modified value of "hookedAt" should return false', async function () {
        const newWebhook = await Webhook.findOne({playerId: 'test_id_1'});
        newWebhook.hookedAt = new Date('1984-01-01');
        return webhookService.processWebhookAfterSendingPlayerMessage(newWebhook, scheduleService).then(result => {
            assert.typeOf(result, 'boolean');
            assert.equal(result, false);
        });
    });

    it('WebhookService.processWebhookAfterSendingPlayerMessage for webhook with value of "sentAfterHook" that exceeds set limit (MAX_SAFE_INTEGER is taken to ease the process of writing this test) should return an object with the value of field "deletedCount" equal to 1', async function () {
        const playedId = 'test_id_1';
        let newWebhook = await Webhook.findOne({playerId: playedId});
        newWebhook.sentAfterHook = Number.MAX_SAFE_INTEGER - 1;
        return webhookService.processWebhookAfterSendingPlayerMessage(newWebhook, scheduleService).then(result => {
            assert.typeOf(result, 'object');
            assert.equal(result.deletedCount, 1);
        });
    });
});