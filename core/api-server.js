const http = require('http');

class APIServer {
    constructor(port){
        this.port = port;
        this.httpServer = http.createServer();
        this.setRouteHandlers();
    }

    run(){
        this.httpServer.listen(this.port, () => console.log('Web server is up and running!'));
    }

    stop(){
        this.httpServer.close(() => console.log('Web server has been stopped'));
    }

    setRouteHandlers(){
        this.httpServer.on('request', (req, res) => {
            console.log(`API server handled request: ${req.url}`);
            res.end(`It's a mock! Accessed at ${new Date().toISOString()}`)
        });
    }
}

module.exports = APIServer;