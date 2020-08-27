require('dotenv').config();
const assert = require('chai').assert;
const {SchedulerWorker} = require('../../core/workers/index');
const worker = new SchedulerWorker(1000, 'test', 'test');
describe('SchedulerWorker', function () {
    it('MessageGenerator.fetchMessagesToSend() should return a non-empty array', function () {
        return worker.fetchMessagesToSend().then(result => {
            assert.typeOf(result, 'array');
            assert.isAbove(result.length, 0);
        });

    });

    it('MessageGenerator.fetchMessagesToSend() every object inside returned array must have a field "playerId" of type string with a length above 3', function () {
        return worker.fetchMessagesToSend().then(result => {
            result.forEach(item => {
                assert.typeOf(item.playerId, 'string');
                assert.isAbove(item.playerId.length, 0);
            });
        });
    });

    it('MessageGenerator.fetchMessagesToSend() object with "playerId" equal to "instant_id_222" from the returned array must have a field "friends" that contains an array of objects', function () {
        return worker.fetchMessagesToSend().then(result => {
            console.log(result.find(p => p.playerId === 'instant_id_222'));
            assert.typeOf(result.player, 'object');
            assert.typeOf(result.player.friends, 'array');
            assert.isAbove(result.player.friends.length, 0);
        });
    });
});