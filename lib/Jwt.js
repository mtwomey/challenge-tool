'use strict';

class Jwt {
    constructor(jwt) {
        this.token = jwt;
        [this.header, this.payload, this.signature] = this.token.split('.');
        this.header = JSON.parse(btoa(this.header));
        this.payload = JSON.parse(btoa(this.payload));
        this.expiration = new Date(this.payload.exp * 1000);
        let x = 10;
    }

    isExpired() {
        return Date.now() > this.expiration;
    }
}

function btoa(data) {
    return new Buffer.from(data, 'base64').toString('ascii');
}

module.exports = Jwt;
