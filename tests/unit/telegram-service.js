require('dotenv').config();
const assert = require('chai').assert;
const TelegramService = require('../../core/services/telegram-service');

describe('TelegramService', function () {
    const tg = new TelegramService();
    this.timeout(5000);
    it('After awaiting for TelegramService.run its property isUp should contain value true', async function() {
        await tg.run();
        assert.equal(tg.isUp, true);
    });

    it('TelegramService.sendMessage should return an object with field "message_id" that contains a numeric value', async function() {
        tg.targetChatId = process.env.TELEGRAM_BOT_TARGET_TEST_CHAT_ID;
        const res = await tg.sendMessage('Running unit test');
        assert.typeOf(res.message_id, 'number')
    });

    it('TelegramService.formatUptime for the value of 2592000000 ms (which is an equivalent of 30 days) should return "30d00:00:00"', async function() {
        const res = tg.formatUptime(2592000000);
        assert.equal(res, '30d00:00:00');
    });

    it('TelegramService.formatUptime for the value of 3661000 ms (which is an equivalent of 1 hour, 1 minute, 1 second) should return "0d01:01:01"', async function() {
        const res = tg.formatUptime(3661000);
        assert.equal(res, '0d01:01:01');
    });

    it('TelegramService.formatUptime for the value false should return 0', async function() {
        const res = tg.formatUptime(false);
        assert.equal(res, 0);
    });

    it('TelegramService.formatUptime for the value 42 should return "0d00:00:00"', async function() {
        const res = tg.formatUptime(42);
        assert.equal(res, '0d00:00:00');
    });

    it('TelegramService.setSystemMetaInfo should set specified property called "test" inside object "systemMetaInfo"', async function() {
        tg.setSystemMetaInfo('test', 'testval');
        assert.equal(tg.systemMetaInfo.test, 'testval');
    });

    it('TelegramService.getPlayerQueueMessagesAmount should return value equal to 20', async function() {
        tg.setSystemMetaInfo('queueLength', 20);
        const amount = tg.getPlayerQueueMessagesAmount();
        assert.equal(amount, 20);
    });

    it('TelegramService.getPlayerQueueMessagesAmount should return value equal to "unknown"', async function() {
        tg.setSystemMetaInfo('queueLength', undefined);
        const amount = tg.getPlayerQueueMessagesAmount();
        assert.equal(amount, 'unknown');
    });
});