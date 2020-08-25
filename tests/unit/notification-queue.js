const assert = require('chai').assert;

const NotificationQueue = require('../../core/services/notification-queue');
const RedisClient = require('redis').RedisClient;

describe('NotificationQueue', function () {
    let notificationQueue;

    it('NotificationQueue.constructor() should return instance of NotificationQueue', function () {
        notificationQueue = new NotificationQueue(process.env.REDIS_HOST, process.env.REDIS_PORT);
        assert.instanceOf(notificationQueue, NotificationQueue);
    });

    it('After running NotificationQueue.connectToRedis(), property redisClient should be instance of RedisClient', function () {
        notificationQueue.connectToRedis(notificationQueue.host, notificationQueue.port);
        assert.instanceOf(notificationQueue.redisClient, RedisClient);
    });

    it('After running NotificationQueue.disconnectFromRedis(), property isUp should be equal to false', function () {
        return notificationQueue.disconnectFromRedis().then(function () {
            assert.equal(notificationQueue.isUp, false);
        });

    });

    it('After running NotificationQueue.init() "connect" event should be fired and property isUp should be equal to true', function () {
        notificationQueue.init();
        notificationQueue.redisClient.on('connect', function () {
            assert.equal(notificationQueue.isUp, true);
        });

    });

    let pushedObject = {name: 'Value from unit test', dt: Date.now()};
    it('NotificationQueue.push() should return number of rows after insertion and it should be >= 1', function () {
        notificationQueue.redisClient.flushall();
        return notificationQueue.push('notifications', pushedObject).then( result => {
            assert.typeOf(result, 'number');
            assert.isAtLeast(result, 1);
        });

    });

    it('NotificationQueue.pop() should return object with property name that should be equal to the value of pushedObject.name', function () {
        return notificationQueue.pop('notifications').then( result => {
            assert.typeOf(result, 'object');
            assert.equal(result.name, pushedObject.name);
        });

    });

    it('NotificationQueue.pushMultiple() should return number of rows after insertion and it should be = 2', function () {
        notificationQueue.redisClient.flushall();
        return notificationQueue.pushMultiple('notifications', [pushedObject, pushedObject]).then( result => {
            assert.typeOf(result, 'number');
            assert.equal(result, 2);
        });
    });

});