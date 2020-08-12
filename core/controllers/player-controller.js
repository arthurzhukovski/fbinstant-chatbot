const PlayerService = require('../services/player-service');

class PlayerController{
    constructor(){
        this.playerService = new PlayerService();
    }
    createOrUpdate(req, res){
        let playerDataFromClient;
        try{
            playerDataFromClient = this.playerService.fetchPlayerDataFromRawInput(req.body);
        }catch (error) {
            return res.status(400).json({ok: false, msg: `Parameter validation failed: ${error}`});
        }
        this.playerService.createOrUpdatePlayer(playerDataFromClient).then((newPlayerObjectFromDb) => {
            console.log(newPlayerObjectFromDb);
            //let responseObject = this.playerService.getPlayerAdditionalData(playerDataFromClient.instantId);
            this.playerService.getFriendsByIdList(playerDataFromClient.friends).then(friends => {
                newPlayerObjectFromDb.friends = friends;
            }).catch(error => {
                console.error(`Failed to fetch player's friend list after upsert: ${error}`);
                newPlayerObjectFromDb.friends = [];
            }).finally(()=>{
                res.json(newPlayerObjectFromDb);
            });
        }).catch(error => {
            console.error(`Failed to update player data: ${error}`);
            res.status(502).json({ok: false, msg: `Failed to update player data`});
        });
    }

    // getAll(req, res){
    //     Player.find().then(players => {
    //         res.json(players);
    //     }).catch(error => {
    //         console.error(`Failed to get players: ${error}`);
    //         res.status(409).json({ok: false, msg: `Failed to get players list`});
    //     });
    // }
    //
    // getById(req, res){
    //     const playerId = req.params.id;
    //     Player.findOne({_id: playerId}).then(player => {
    //         if (player === null){
    //             res.status(404).json({ok: false, msg: `Player with id ${playerId} not found`});
    //         }else{
    //             res.json(player);
    //         }
    //     }).catch(error => {
    //         console.error(`Failed get player: ${error}`);
    //         res.status(409).json({ok: false, msg: `Failed to get player with id ${playerId}`});
    //     })
    // }
}

module.exports = PlayerController;