const redis = require('redis');
const promisify = require('util').promisify;

class NotificationQueue {
    constructor(host = '127.0.0.1', port = 6379){
        this.connectToRedis(host, port);
        this.setRedisConnectionStatusHandlers(this.redisClient);
        this.lpopWithPromise = promisify(this.redisClient.lpop).bind(this.redisClient);
        this.rpushWithPromise = promisify(this.redisClient.rpush).bind(this.redisClient);
    }

    connectToRedis(host, port){
        this.redisClient = redis.createClient(port, host);
    }

    disconnectFromRedis(){
        this.redisClient.quit();
    }

    async push(listName, notificationObject){
        if(notificationObject){
            if (typeof notificationObject === 'object'){
                notificationObject = JSON.stringify(notificationObject);
            }
            return  await this.rpushWithPromise(listName, notificationObject);
        } else {
            return Promise.reject(new Error('Notification queue item must not evaluate to false'));
        }
    }

    async pop(listName){
        const rawResponse = await this.lpopWithPromise(listName);
        try {
            return JSON.parse(rawResponse);
        }catch (error) {
            return rawResponse;
        }
    }

    setRedisConnectionStatusHandlers(client){
        const classContext = this;

        client.on('connect', function () {
            classContext.isUp = true;
            console.log('Connected to Redis');
        });

        client.on('error', function (error) {
            classContext.disconnectFromRedis();
            console.error(`Failed connecting to redis: ${error}`);
        });

        client.on('end', function () {
            classContext.isUp = false;
            console.log('Redis connection has been closed');
        });
    }
}

module.exports = NotificationQueue;