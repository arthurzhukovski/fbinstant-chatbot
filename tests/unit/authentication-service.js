require('dotenv').config();
const assert = require('chai').assert;
const http = require('http');
const AuthenticationService = require('../../core/services/authentication-service');

describe('APIServer', function () {
    const payload = {player_id: 'instant_id_222'}

    it('AuthenticationService.generateToken() should return a string', function () {
        const token = AuthenticationService.generateToken(payload);
        assert.typeOf(token, 'string');
        console.log(token);
    });

    it('AuthenticationService.generateToken() split by dot should return an array with a length of 2', function () {
        const token = AuthenticationService.generateToken(payload);
        assert.equal(token.split('.').length, 2);
    });

});