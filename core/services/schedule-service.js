const MILLISECONDS_PER_HOUR = 60 * 60 * 1000;
const HOURS_PER_DAY = 24;
class ScheduleService{
    constructor(){
        this.sendingHourLimits = {min: 7, max: 23};
        if(process.env.SCHEDULE){
            this.schedule = process.env.SCHEDULE.split(',').map(value => parseInt(value.trim()));
        }else{
            this.schedule = [5, 24, 72, 168, 672];
            console.error('ScheduleService: process.env.SCHEDULE is not defined');
        }
    }

    getDefaultTimeToSendAt(tzOffset){
        return this.getTimeToSendAt(0, tzOffset);
    }

    getTimeToSendAt(scheduleIndex, tzOffset = 0, hookedAtTimestamp = Date.now()){
        let timeToSendAt = new Date(hookedAtTimestamp + this.schedule[scheduleIndex] * MILLISECONDS_PER_HOUR);
        return this.correctSendingTimeAccordingToTimezone(timeToSendAt, tzOffset);
    }

    correctSendingTimeAccordingToTimezone(timeToSendAt, tzOffset){
        let playerHoursAtSendingTime = this.calculatePlayerHours(timeToSendAt.getUTCHours(), tzOffset);
        while (playerHoursAtSendingTime < this.sendingHourLimits.min || playerHoursAtSendingTime > this.sendingHourLimits.max){
            timeToSendAt.setTime(timeToSendAt.getTime() + MILLISECONDS_PER_HOUR);
            playerHoursAtSendingTime =  this.calculatePlayerHours(timeToSendAt.getUTCHours(), tzOffset);
        }
        return timeToSendAt;
    }

    calculatePlayerHours(UTCHours, tzOffset){
        let hoursWithoutNegativeCorrection = (UTCHours + tzOffset) % HOURS_PER_DAY;
        return hoursWithoutNegativeCorrection < 0 ? HOURS_PER_DAY + hoursWithoutNegativeCorrection : hoursWithoutNegativeCorrection;
    }
}

module.exports = ScheduleService;