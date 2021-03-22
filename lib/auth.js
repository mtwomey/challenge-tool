'use strict';

const open = require('open');
const crypto = require('crypto');
const config = require('../config/config');
const fs = require('fs');
const Jwt = require('../lib/jwt');
const fastify = require('fastify')();

const TEMP_TOKEN_STORAGE = '/tmp/.tc_access_token';

let listenerPort = 3000;

function getJWT() {
    return new Promise((resolve, reject) => {
        // Get the token from temp storage and return it if it's not expired
        if (fs.existsSync(TEMP_TOKEN_STORAGE)) {
            let jwt = new Jwt(fs.readFileSync(TEMP_TOKEN_STORAGE, 'utf8'));
            if (!jwt.isExpired())
                return resolve(jwt);
        }

        // Get a new token
        const params = {
            client_id: config.auth.clientId,
            response_type: 'code',
            scope: 'openid profile email',
            audience: config.auth.audience, // audience must be specified in order to get JWT instead of opaque token
            redirect_uri: config.auth.redirectUri,
            state: getRandomString(10) // not checking this anywhere right now...
        };
        const authUrl = `${config.auth.endpointAuthorize}?${Object.entries(params).map(param => {
            return `${param[0]}=${param[1]}`;
        }).join('&')}`;

        open(authUrl);

        // Start a temporary server specifically to receive the final callback
        fastify.get('/', (req, res) => {
            res.send('Auth Complete. You may close this tab.');
            fastify.close();
            fs.writeFileSync(TEMP_TOKEN_STORAGE, req.query.access_token);
            resolve(new Jwt(req.query.access_token));
        });
        fastify.listen(listenerPort);
    });
}

function getRandomString(length, charset) {
    charset = charset || 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    let randomBytes = crypto.randomBytes(length);
    for (let i = 0; i < length; i++) {
        result += charset[randomBytes[i] % charset.length];
    }
    return result;
}

module.exports = {
    getJWT: getJWT
};
