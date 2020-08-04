const assert = require('chai').assert;
const {MessengerWorker, SchedulerWorker} = require('../../core/workers/index');

describe('Workers', function () {
    let messengerWorker = new MessengerWorker();
    let schedulerWorker = new SchedulerWorker();

    it('After messengerWorker.run() object\'s property "interval._idleTimeout" be above 0', function () {
        messengerWorker.run();
        assert.isAbove(messengerWorker.interval._idleTimeout, 0);
    });

    it('After messengerWorker.stop() object\'s property "interval._idleTimeout" be equal to -1', function () {
        messengerWorker.stop();
        assert.equal(messengerWorker.interval._idleTimeout, -1);
    });

    it('After schedulerWorker.run() object\'s property "interval._idleTimeout" be above 0', function () {
        schedulerWorker.run();
        assert.isAbove(schedulerWorker.interval._idleTimeout, 0);
    });

    it('After schedulerWorker.stop() object\'s property "interval._idleTimeout" be equal to -1', function () {
        schedulerWorker.stop();
        assert.equal(schedulerWorker.interval._idleTimeout, -1);
    });
});