const express = require('express');
const DatabaseConnectionManager = require('./services/database-connection-manager');
const PlayerController = require('./controllers/player-controller');
const WebhookController = require('./controllers/webhook-controller');

class APIServer {
    constructor(port){
        this.isUp = false;
        this.port = port;
        this.httpServer = express();
        this.httpServer.use(express.json());
        this.dbManager = new DatabaseConnectionManager(process.env.MONGO_URI || 'mongodb://localhost:27017/fbinstant-chatbot');

        this.playerController = new PlayerController();
        this.webhookController = new WebhookController();

        this.setRouteHandlers();
    }

    run(){
        this.connection = this.httpServer.listen(this.port, () => {
            this.isUp = true;
            console.log(`Web server is up and running on port ${this.port}!`);
        });
        this.dbManager.connect();
    }

    stop(){
        if(this.isUp && this.connection){
            this.connection.close(() => {
                this.isUp = false;
                console.log('Web server has been stopped');
            });
        }else
            console.log('Failed to close connection: server is not running');
    }

    setRouteHandlers(){
        this.httpServer.get('/healthcheck', (req, res) => res.status(200));
        this.httpServer.post('/api/login', (req, res) => {this.playerController.createOrUpdate(req, res)});
        this.httpServer.get('/api/hook', (req, res) => {this.webhookController.verify(req, res)});
        this.httpServer.post('/api/hook', (req, res) => {this.webhookController.createOrUpdate(req, res)});

        this.httpServer.get('*', (req, res) => {
            res.status(404).send({ok: false, msg: `Resource ${req.originalUrl} not found`});
        });

        this.httpServer.use((error, req, res, next) => {
            console.error(`Middleware error at ${req.method} ${req.originalUrl}: ${error}`);
            console.error(error);
            res.status(400).send({ok: false, msg: 'Request can\'t be handled'});
        });
    }
}

module.exports = APIServer;