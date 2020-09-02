const axios = require('axios');

class MessagingService{
    constructor(){
        this.token = process.env.PAGE_ACCESS_TOKEN || '';
    }
    async sendPlayerMessage(message){
        //todo: implement method
        const requestURI = `https://graph.facebook.com/v7.0/me/messages?access_token=${this.token}`;

        return axios({
            method: 'POST',
            url: requestURI,
            data: {message: message, recipient: {id: message.messengerId}}
        });
    }
}

module.exports = MessagingService;