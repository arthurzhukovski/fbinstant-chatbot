const assert = require('chai').assert;
const http = require('http');
const APISever = require('../../core/api-server');

describe('APIServer', function () {
    let apiServer = new APISever(54321);

    it('APIServer.run() should start listening for incoming connections', function () {
        apiServer.run();
        http.get("http://localhost:54321/", function(response) {
            assert.equal(response.statusCode, 200);
        })
    });

    it('APIServer.stop() should make the web server stop listening for connections', function () {
        apiServer.stop();
            http.get("http://localhost:54321/", function() {
            }).on("error", error => {
                assert.equal(error.code, 'ECONNREFUSED');
            });
    });
});