class MessagingService{
    async sendPlayerMessage(message){
        //todo: implement method
        console.log(`Sending message for player ${message.playerId} to facebook... `)
        return Promise.resolve();
    }
}

module.exports = MessagingService;