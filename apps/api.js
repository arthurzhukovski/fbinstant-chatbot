const APIServer = require('../core/api-server.js');
const HTTP_PORT = process.env.PORT || 6969;

const apiSever = new APIServer(HTTP_PORT);
apiSever.run();