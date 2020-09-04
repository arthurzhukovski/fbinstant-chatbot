require('dotenv').config();
const assert = require('chai').assert;
const MessageGenerator = require('../../core/utils/message-generator');

describe('MessageGenerator', function () {
    const messageGenerator = new MessageGenerator();
    let webhook = {"senderId":"<PSID>","contextId":"cid","createdAt": new Date("2020-08-19T13:16:59.038Z"),"hookedAt":new Date("2020-08-20T13:29:01.131Z"),"playerId":"instant_id_111","sendAt":new Date("2020-08-20T18:29:01.131Z"),"sentAfterHook":0};
    webhook.player = {lastPushType: 'lagging', locale: 'ru_RU', friendsObjects: [{name: 'Bob'}, {name: 'Alice'}]};

    const message = messageGenerator.generateMessage(webhook);

    it('MessageGenerator.generateMessage() should return a message object with non-empty "text" property of type string with length above 3', function () {
        assert.typeOf(message.text, 'string');
        assert.isAbove(message.text.length, 3);
    });

    it('MessageGenerator.generateMessage() should return a message object with non-empty "messengerId" property of type string with length above 3', function () {
        assert.typeOf(message.messengerId, 'string');
        assert.isAbove(message.messengerId.length, 3);
    });

    it('MessageGenerator.generateMessageContent() should return an object with 3 fields  of type string with length above 3', function () {
        let result = messageGenerator.generateMessageContent(webhook.player);
        ['text', 'imageUrl', 'type'].forEach(pName => {
            assert.typeOf(result[pName], 'string');
            assert.isAbove(result[pName].length, 3);
        });
    });

    it('MessageGenerator.findSuitableMessageTemplate() should return an object with a valid "type" field value', function () {
        let player = {lastPushType: 'connect', locale: 'ru_RU', friendsObjects: [{name: 'Bob'}]};
        let result = messageGenerator.findSuitableMessageTemplate(player);
        assert.equal(result.type, 'lagging');

        player.lastPushType = 'lagging';
        result = messageGenerator.findSuitableMessageTemplate(player);
        assert.equal(result.type, 'connect');

        player.lastPushType = 'new_levels';
        player.friendsObjects = null;
        result = messageGenerator.findSuitableMessageTemplate(player);
        assert.equal(result.type, 'relax');

        player.lastPushType = 'relax';
        result = messageGenerator.findSuitableMessageTemplate(player);
        assert.equal(result.type, 'new_levels');
    });

    it('MessageGenerator.findSuitableMessageTemplate() should return a valid translation for a known locale and the first found for unknown', function () {
        let player = {lastPushType: 'new_levels'};
        let tpl = messageGenerator.findSuitableMessageTemplate(player);

        let result = messageGenerator.getTextTemplateByLocale(tpl.text, 'en_US');
        assert.equal(result, 'It\'s time to relax!');

        result = messageGenerator.getTextTemplateByLocale(tpl.text, 'ru_RU');
        assert.equal(result, 'Самое время отдохнуть!');

        result = messageGenerator.getTextTemplateByLocale(tpl.text, undefined);
        assert.equal(result, 'It\'s time to relax!');
    });

    it('MessageGenerator.fillFriendPlaceholders() should place the passed name value at the beginning of the string', function () {
        let player = {lastPushType: 'connect', locale: 'ru_RU', friendsObjects: [{name: 'Bob'}]};
        let tpl = messageGenerator.findSuitableMessageTemplate(player);
        let txt = messageGenerator.getTextTemplateByLocale(tpl.text, 'en_US');
        let result = messageGenerator.fillFriendPlaceholders(txt, player.friendsObjects[0]);
        assert.equal(result.substring(0, 3), player.friendsObjects[0].name);
    });

    it('MessageGenerator.getImageUrl() should return a non-empty string with length above 3', function () {
        let result = messageGenerator.getImageUrl(webhook.type, webhook.player.friendsObjects[0]);
        assert.typeOf(result, 'string');
        assert.isAbove(result.length, 3);
    });

    it('MessageGenerator.getRandomFriend() should return an object with a non empty field "name" of type string', function () {
        let result = messageGenerator.getRandomFriend(webhook.player.friendsObjects);
        assert.typeOf(result.name, 'string');
        assert.isAbove(result.name.length, 0);
    });


    it('MessageGenerator.getDayAtPlayground() should return a positive integer when a correct parameter is passed', function () {
        let dt = new Date();
        const createdAt = (dt.setDate(dt.getDate()-5));
        let result = messageGenerator.getDayAtPlayground(createdAt);
        assert.typeOf(result, 'number');
        assert.equal(result, 5);
    });

    it('MessageGenerator.generateMessage() should return a message object with non-empty "playground.dayNumber" property of type number with value above 0', function () {
        assert.typeOf(message.playground.dayNumber, 'number');
        assert.isAbove(message.playground.dayNumber, 0);
    });

});