require('dotenv').config();
const assert = require('chai').assert;
const MessagingService = require('../../core/services/messaging-service');
const MessageGenerator = require('../../core/utils/message-generator');
const PlayerService = require('../../core/services/player-service');

describe('MessagingService', async function () {

    const messagingService = new MessagingService();
    const messageGenerator = new MessageGenerator();
    const playerService = new PlayerService();

    // it('MessagingService.sendPlayerMessage should return an object with the value of field "status" equal to 200', async function f() {
    //     const playerId = 'test_id_1';
    //     let player = await playerService.getPlayer(playerId);
    //     let newWebhook = {senderId: '100019063402567', playerId: playerId, context_id: 'test_context_id_1', player: player ? player : null};
    //     const message = messageGenerator.generateMessage(newWebhook);
    //
    //     try{
    //         const response = await messagingService.sendPlayerMessage(message);
    //         console.log(response.data);
    //         assert.equal(response.status, 200)
    //     }catch (error) {
    //         console.log(error);
    //         throw new Error(`${JSON.stringify(error.response.data)} \r\n Request body: ${error.config.data}`);
    //     }
    // });
});