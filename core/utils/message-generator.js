const MESSAGE_TEMPLATES = require('../../addons/message-templates');

class MessageGenerator{

    generateMessage(webhook){
        const messageContent = this.generateMessageContent(webhook.player);
        return {
            text: messageContent.text,
            messengerId: webhook.senderId,
            playerId: webhook.playerId,
            //todo: determine from where to get this value:
            opponentId: null,
            title: 'Play',
            locale: webhook.player.locale,
            imageUrl: messageContent.imageUrl,
            payload: {
                sender: 'server',
                ts: Date.now(),
                type: messageContent.type
            },
            playground: {
                dayNumber: 0,
                //todo: determine from where to get this value:
                opponentId: null,
                contextId: webhook.contextId
            }
        };
    }

    generateMessageContent(player){
        const template = this.findSuitableMessageTemplate(player);
        let imageUrl;
        let messageText = this.getTextTemplateByLocale(template.text, player.locale);
        if (template.isSocial){
            const randomFriend = this.getRandomFriend(player.friendsObjects);
            messageText = this.fillFriendPlaceholders(messageText, randomFriend);
            imageUrl = this.getImageUrl(template.type, randomFriend);
        }else{
            imageUrl = this.getImageUrl(template.type);
        }
        return {text: messageText, imageUrl: imageUrl, type: template.type};
    }

    findSuitableMessageTemplate(player) {
        const isSocial = !!player.friendsObjects && player.friendsObjects.length > 0;
        if (MESSAGE_TEMPLATES && MESSAGE_TEMPLATES.length){
            const template = MESSAGE_TEMPLATES.find(tpl => {
                return tpl.isSocial === isSocial && tpl.type !== player.lastPushType;
            });
            if (!template)
                throw new Error(`Unable to generate message template for player: ${player}`);
            return template;
        }else
            throw new Error('Message templates array is empty');
    }

    fillFriendPlaceholders(templateText, friend){
        return templateText.replace('{friend_name}', friend.name);
    }

    getImageUrl(messageType, friend){
        //todo: implement method
        return 'https://facebookbrand.com/wp-content/uploads/2019/04/f_logo_RGB-Hex-Blue_512.png?w=512&h=512';
    }

    getRandomFriend(friendsObjects){
        const randomFriendIndex = Math.floor(Math.random() * Math.floor(friendsObjects.length));
        return friendsObjects[randomFriendIndex];
    }

    getTextTemplateByLocale(textArray, locale){
        const textTemplate = textArray.find(t => t.locale === locale);
        return textTemplate ? textTemplate.value : textArray[0].value;
    }

}

module.exports = MessageGenerator;