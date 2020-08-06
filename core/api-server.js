const express = require('express');
const Player = require('./models/player');
const DatabaseConnectionManager = require('./services/database-connection-manager');

class APIServer {
    constructor(port){
        this.port = port;
        this.httpServer = express();
        this.httpServer.use(express.json());
        this.setRouteHandlers();
        this.dbManager = new DatabaseConnectionManager(process.env.MONGO_URI || 'mongodb://localhost:27017/fbinstant-chatbot');
    }

    run(){
        this.httpServer.listen(this.port, () => console.log(`Web server is up and running on port ${this.port}!`));
        this.dbManager.connect();
    }

    stop(){
        this.httpServer.close(() => console.log('Web server has been stopped'));
    }

    setRouteHandlers(){
        this.httpServer.get('request', (req, res) => {
            console.log(`API server handled request: ${req.url}`);
            res.end(`It's a mock! Accessed at ${new Date().toISOString()}`)
        });

        this.httpServer.get('/api/players', (req, res) => {
            Player.find().then(players => {
                res.json(players);
            }).catch(error => {
                console.error(`Failed get players: ${error}`);
                res.status(409).json({ok: false, msg: `Failed to get players list`});
            });

        });

        this.httpServer.get('/api/player', (req, res) => {
            Player.findOne({_id: req.body.id}).then(player => {
                if (player === null){
                    res.status(404).json({ok: false, msg: `Player with id ${req.body.id} not found`});
                }else{
                    res.json(player);
                }

            }).catch(error => {
                console.error(`Failed get player: ${error}`);
                res.status(409).json({ok: false, msg: `Failed to get player with id ${req.body.id}`});
            });

        });

        this.httpServer.post('/api/player', (req, res) => {
            const newPlayer = {
                name: req.body.name,
                age: req.body.age,
                email: req.body.email,
            };
            Player.create(newPlayer).then(response => {
                res.json({ok: true, msg: response});
            }).catch(error => {
                console.error(`Failed to insert player: ${error}`);
                res.status(409).json({ok: false, msg: `Failed to create new player`});
            });

        });

        this.httpServer.put('/api/player', (req, res) => {
            const fieldsToUpdate = {
                name: req.body.name,
                age: req.body.age,
                email: req.body.email,
            };
            Player.updateOne({_id: req.body.id}, fieldsToUpdate).then(response => {
                if (response === null){
                    res.status(404).json({ok: false, msg: `Player with id ${req.body.id} not found`});
                }else{
                    res.json(response);
                }

            }).catch(error => {
                console.error(`Failed get player: ${error}`);
                res.status(409).json({ok: false, msg: `Failed to get player with id ${req.body.id}`});
            });

        });
    }
}

module.exports = APIServer;