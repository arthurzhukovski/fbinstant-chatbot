const Player = require('../models/player');
const ParameterFetcher = require('../utils/parameter-fetcher');

class PlayerService {
    async createOrUpdatePlayer(playerFields){
        return Player.updateOne({ instantId: playerFields.instantId }, playerFields, { upsert: true });
    }

    getPlayerAdditionalData(instantId){
        return {
            score: this.getPlayerScore(instantId),
            ads: this.shouldPlayerReceiveAds(instantId),
            coins: this.getPlayerCoins(instantId)
        };
    }

    getFriendsByIdList(instantIds){
        return Player.find({instantId: {$in: instantIds}}, {_id: 0, instantId: 1, name: 1, avatar: 1});
    }

    getPlayerScore(instantId){
        //todo: implement fetching of "score"
        return 0;
    }

    getPlayerCoins(instantId){
        //todo: implement fetching of "coins"
        return 0;
    }

    shouldPlayerReceiveAds(instantId){
        //todo: implement fetching of "ads"
        return true;
    }

    fetchPlayerDataFromRawInput(rawData){
        const possibleParams = {
            instantId: {type: 'string', required: true},
            name: {type: 'string', required: true},
            avatar: {type: 'string', required: true},
            tzOffset: {type: 'number', required: true},
            locale: {type: 'string', required: true},
            friends: {type: 'array', required: false},

        };
        return ParameterFetcher.retrieveAndValidate(possibleParams, rawData);
    }
}

module.exports = PlayerService;