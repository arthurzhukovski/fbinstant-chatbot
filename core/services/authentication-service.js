const Utf8 = require('crypto-js/enc-utf8');
const Base64 = require('crypto-js/enc-base64');
const HmacSHA256 = require('crypto-js/hmac-sha256');

class AuthenticationService{

    static verifyPlayerBySignatureAndGetPayload(signatureFromClient, instantId) {
        if (!signatureFromClient) {
            throw new Error('No signature has been provided')
        }
        if(process.env.APP_SECRET){
            let [ encodedSignature, encodedPayload ] = signatureFromClient.split('.');

            const signature = Base64.parse(this.base64FromWebSafe(encodedSignature)).toString();
            const hashedPayload = HmacSHA256(encodedPayload, process.env.APP_SECRET).toString();

            if (signature !== hashedPayload) {
                throw new Error('Signature does not match payload');
            }

            const payload = JSON.parse(Base64.parse(encodedPayload).toString(Utf8));

            if (instantId && payload.player_id !== instantId) {
                throw new Error('Instant ID from signature payload doesn\'t match provided instant ID from request body');
            }

            return payload;
        }else{
            throw new Error('Unable to find app secret');
        }
    }

    static generateToken(payload) {
        if(process.env.APP_SECRET){
            const encodedPayload = Base64.stringify(Utf8.parse(JSON.stringify(payload)));
            const signature = this.base64ToWebSafe(Base64.stringify(HmacSHA256(encodedPayload, process.env.APP_SECRET)));
            return `${signature}.${encodedPayload}`;
        }else{
            throw new Error('Unable to find app secret');
        }
    }

    static base64FromWebSafe(encodedValue){
        return encodedValue.replace(/-/g, '+').replace(/_/g, '/');
    }

    static base64ToWebSafe(encodedValue){
        return encodedValue.replace(/\+/g, '-').replace(/\//g, '_');
    }
}

module.exports = AuthenticationService;