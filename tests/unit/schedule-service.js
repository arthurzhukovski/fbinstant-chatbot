const assert = require('chai').assert;
const ScheduleService = require('../../core/services/schedule-service');

describe('ScheduleService', function () {
    const suitableDateTime = new Date(Date.UTC(1970, 11, 25, 15, 30));
    const unsuitableDateTime = new Date(Date.UTC(1970, 11, 25, 22, 25));
    const scheduleService = new ScheduleService();
    it('ScheduleService.getTimeToSendAt return value for 1970-12-25T15:30:00 and no tz offset should return .getUTCHours() value equal to 20', function () {
       const tts = scheduleService.getTimeToSendAt(0, 0, suitableDateTime.getTime());
       assert.equal(tts.getUTCHours(), 20);
    });
    it('ScheduleService.getTimeToSendAt return value for 1970-12-25T15:30:00 and -3 tz offset should return .getUTCHours() value equal to 17', function () {
       const tts = scheduleService.getTimeToSendAt(0, -3, suitableDateTime.getTime());
       assert.equal(tts.getUTCHours(), 20);
    });
    it('ScheduleService.getTimeToSendAt return value for 1970-12-25T15:30:00 and 5 tz offset should return .getUTCHours() value equal to 2', function () {
       const tts = scheduleService.getTimeToSendAt(0, 5, suitableDateTime.getTime());
       assert.equal(tts.getUTCHours(), 2);
    });
    it('ScheduleService.getTimeToSendAt return value for 1970-12-25T22:25:00 and no tz offset should return .getUTCHours() value equal to 7', function () {
       const tts = scheduleService.getTimeToSendAt(0, 0, unsuitableDateTime.getTime());
       assert.equal(tts.getUTCHours(), 7);
    });
    it('ScheduleService.getTimeToSendAt return value for 1970-12-25T22:25:00 and -4 tz offset should return .getUTCHours() value equal to 3', function () {
       const tts = scheduleService.getTimeToSendAt(0, -4, unsuitableDateTime.getTime());
       assert.equal(tts.getUTCHours(), 3);
    });
});