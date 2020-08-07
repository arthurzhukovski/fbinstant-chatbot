const express = require('express');
const DatabaseConnectionManager = require('./services/database-connection-manager');
const PlayerController = require('./controllers/player-controller');
const WebhookController = require('./controllers/webhook-controller');

class APIServer {
    constructor(port){
        this.port = port;
        this.httpServer = express();
        this.httpServer.use(express.json());
        this.dbManager = new DatabaseConnectionManager(process.env.MONGO_URI || 'mongodb://localhost:27017/fbinstant-chatbot');

        this.playerController = new PlayerController();
        this.webhookController = new WebhookController();

        this.setRouteHandlers();
    }

    run(){
        this.httpServer.listen(this.port, () => console.log(`Web server is up and running on port ${this.port}!`));
        this.dbManager.connect();
    }

    stop(){
        this.httpServer.close(() => console.log('Web server has been stopped'));
    }

    setRouteHandlers(){
        this.httpServer.post('/api/login', (req, res) => {this.playerController.createOrUpdate(req, res)});
        this.httpServer.get('/api/hook', (req, res) => {this.webhookController.verify(req, res)});
        this.httpServer.post('/api/hook', (req, res) => {this.webhookController.createOrUpdate(req, res)});

        this.httpServer.get('*', (req, res) => {
            res.status(404).send({ok: false, msg: `Resource ${req.originalUrl} not found`});
        });
    }
}

module.exports = APIServer;