const Worker = require('./worker');
class SchedulerWorker extends Worker{
    constructor(intervalInMs, workerName){
        super(intervalInMs, workerName);
        this.mainLoopCallback = this.schedulingLoopIteration;
    }

    schedulingLoopIteration(){
        return 'Fetching data from DB and updating message queue';
    }
}
module.exports = SchedulerWorker;