const assert = require('chai').assert;
const http = require('http');
const APISever = require('../../core/api-server');

describe('APIServer', function () {
    this.timeout(5000);
    let apiServer = new APISever(54321);

    it('APIServer.run() should start listening for incoming connections', function (done) {
        apiServer.run();
        setTimeout( () => {
            assert.equal(apiServer.isUp, true);
            done();
        }, 1000)
    });

    it('APIServer.stop() should make the web server stop listening for connections', function (done) {
        apiServer.stop();
        setTimeout( () => {
            assert.equal(apiServer.isUp, false);
            done();
        });
    });
});