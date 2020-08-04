const Worker = require('./worker');
class MessengerWorker extends Worker{
    constructor(intervalInMs, workerName){
        super(intervalInMs, workerName);
        this.mainLoopCallback = this.messagingLoopIteration;
    }

    messagingLoopIteration(){
        return 'Sending messages and clearing queue';
    }
}
module.exports = MessengerWorker;