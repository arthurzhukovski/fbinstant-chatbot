class Worker{
    constructor(intervalInMs = 1000, processName){
        this.millisecondsDenominator = 1000;
        this.intervalInMs = intervalInMs;
        this.name = processName || `WORKER_${Date.now()}`;
        this.mainLoopCallback = null;
    }

    run(){
        console.log(`Worker ${this.name} is running!`);
        this.interval = setInterval(() => {
            const iterationResult = this.mainLoopCallback();
            console.log(`[${this.name}] at [${new Date().toISOString()}] (executed after ${this.intervalInMs/this.millisecondsDenominator} seconds): ${iterationResult}`);
        }, this.intervalInMs);
    }

}
module.exports = Worker;