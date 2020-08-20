const Player = require('../models/player');
const ParameterFetcher = require('../utils/parameter-fetcher');

class PlayerService {
    async createOrUpdatePlayer(playerFields){
        const fieldsToReturn = {_id: 0, coins: 1, showAds: 1, score: 1};
        return Player.findOneAndUpdate({ instantId: playerFields.instantId }, playerFields, { select: fieldsToReturn, upsert: true, new: true, lean: true, setDefaultsOnInsert: true });
    }

    getFriendsByIdList(instantIds){
        return Player.find({instantId: {$in: instantIds && instantIds.length ? instantIds : []}}, {_id: 0, instantId: 1, name: 1, avatar: 1});
    }

    getPlayer(instantId){
        return Player.findOne({instantId: instantId}, {_id: 0});
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