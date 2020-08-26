const redis = require('redis');
const promisify = require('util').promisify;

class NotificationQueue {
    constructor(host = '127.0.0.1', port = 6379){
        this.host = host;
        this.port = port;
    }

    init(){
        this.connectToRedis(this.host, this.port);
        this.setRedisConnectionStatusHandlers(this.redisClient);
        this.lpopWithPromise = promisify(this.redisClient.lpop).bind(this.redisClient);
        this.rpushWithPromise = promisify(this.redisClient.rpush).bind(this.redisClient);
    }

    connectToRedis(host, port){
        this.redisClient = redis.createClient(port, host);
    }

    async disconnectFromRedis(){
        return (promisify(this.redisClient.quit).bind(this.redisClient))().then(result => {
            if (result === 'OK'){
                console.log('Successfully disconnected from Redis');
                this.isUp = false;
            }else{
                console.error('Failed to close Redis connection');
            }
        }).catch(error => {
            console.error(`Failed to close Redis connection: ${error}`);
        });
    }

    async push(listName, notificationObject){
        if(notificationObject){
            if (typeof notificationObject === 'object'){
                notificationObject = JSON.stringify(notificationObject);
            }
            return  await this.rpushWithPromise(listName, notificationObject);
        }else{
            return Promise.reject(new Error('Notification queue item must not evaluate to false'));
        }
    }

    async pushMultiple(listName, notificationObjects){
        if(notificationObjects){
            if (Array.isArray(notificationObjects)){
                notificationObjects = notificationObjects.map(notification => JSON.stringify(notification));
            }
            return await this.rpushWithPromise(listName, notificationObjects);
        }else{
            return Promise.reject(new Error('NotificationObjects parameter must contain an array'));
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
            console.error(`Failed connecting to Redis: ${error}`);
        });

        client.on('end', function () {
            classContext.isUp = false;
            console.log('Redis connection has been closed');
        });
    }
}

module.exports = NotificationQueue;