require('dotenv').config();
const assert = require('chai').assert;
const PlayerService = require('../../core/services/player-service');
describe('PlayerService', function () {
    const amountOfPlayers = 6;
    const playerService = new PlayerService();
    const basePlayerFields = {
        "instantId": "test_id_",
        "name": "Player #",
        "avatar": "path/to/avatar",
        "tzOffset": 3,
        "locale": "en_US",
        "friends": [

        ]
    };

    it('PlayerService.createOrUpdatePlayer() called multiple times should always return an object with fields "score" (number), "coins" (number) and "showAds" (bool)', async function () {
        for (let i = 1; i <= amountOfPlayers; i++){
            let newPlayer = JSON.parse(JSON.stringify(basePlayerFields));
            newPlayer.instantId += i;
            newPlayer.name += i;
            newPlayer.tzOffset = i;
            newPlayer.friends = [...Array(i-1).keys()].map(item => "test_id_" + (item+1));
            let result = await playerService.createOrUpdatePlayer(newPlayer);
            assert.typeOf(result.coins, 'number');
            assert.typeOf(result.score, 'number');
            assert.typeOf(result.showAds, 'boolean');
        }
    });

    it('PlayerService.getPlayer() for the player with speciefied id should return an object with field "instantId" that contains the same value', async function () {
        const specifiedId = 'test_id_1';
        let result = await playerService.getPlayer(specifiedId);
        assert.equal(result.instantId, specifiedId);
    });

    it('PlayerService.getPlayer() for the player with id than ends with the same number as the value of "amountOfPlayers", should return an array with amountOfPlayers - 1 items', async function () {
        let result = await playerService.getPlayer(`test_id_${amountOfPlayers}`);
        assert.typeOf(result.friends, 'array');
        assert.equal(result.friends.length, amountOfPlayers - 1);
    });

    it('PlayerService.getFriendsByIdList() should return an array of objects that contain field "instantId" with the value of type string, equal to one of those that were passed as the params', async function () {
        let ids = ['test_id_1', 'test_id_2'];
        let result = await playerService.getFriendsByIdList(ids);
        result.forEach(player => {
            assert.typeOf(player.instantId, 'string');
            assert.include(ids, player.instantId);
        });
    });

    it('PlayerService.fetchPlayerDataFromRawInput() should return an object with multiple fields of specified type', function () {
        let result = playerService.fetchPlayerDataFromRawInput(basePlayerFields);
        assert.typeOf(result.instantId, 'string');
        assert.typeOf(result.name, 'string');
        assert.typeOf(result.avatar, 'string');
        assert.typeOf(result.tzOffset, 'number');
        assert.typeOf(result.locale, 'string');
        assert.typeOf(result.friends, 'array');
    });

});