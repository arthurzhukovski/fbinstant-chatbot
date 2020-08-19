class ScheduleService{
    constructor(){
        if(process.env.SCHEDULE){
            this.schedule = process.env.SCHEDULE.split(',').map(value => parseInt(value.trim()));
            console.log(this.schedule);
        }else {
            this.schedule = [5, 24, 72, 168, 672];
            console.error('ScheduleService: process.env.SCHEDULE is not defined');
        }
    }

    getDefaultTimeToSendAt(){
        //todo: find out how to get timezone; find out how to connect player with webhook (sender id with player id)
        return this.getTimeToSendAt(0);
    }

    getTimeToSendAt(scheduleIndex){
        return Date.now() + this.schedule[scheduleIndex] * 60 * 60 * 1000;
    }
}

module.exports = ScheduleService;