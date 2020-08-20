const MILLISECONDS_PER_SECOND = 1000;

class Worker{
    constructor(intervalInMs = MILLISECONDS_PER_SECOND, processName){
        this.intervalInMs = intervalInMs;
        this.name = processName || `WORKER_${Date.now()}`;
        this.mainLoopCallback = null;
    }

    run(){
        console.log(`Worker ${this.name} is running!`);
        this.interval = setInterval(() => {
            this.mainLoopCallback().then((iterationResult)=>{
                const message = this.formatMessage(iterationResult.message);
                const logFunc = iterationResult.ok ? console.log : console.error;
                if (message){
                    logFunc(message);
                }
            }).catch(error => {
                console.error(this.formatMessage(error));
            });
        }, this.intervalInMs);
    }

    stop(){
        clearInterval(this.interval);
    }

    formatMessage(message){
        return !message ? false : `[${this.name}] at [${new Date().toISOString()}] (executed after ${this.intervalInMs/MILLISECONDS_PER_SECOND} seconds): ${message}`;
    }
}
module.exports = Worker;