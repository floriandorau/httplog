
const http = require('http');

const { notNull } = require('./util');
const { debug, error } = require('./logger');

class ProxyRequest {

    constructor(request) {
        notNull(request, 'host must not be null');
        this.request = request;
    }

    write(chunk) {
        debug('ProxyRequest: writing chunk');
        this.request.write(chunk);
    }

    end() {
        debug('ProxyRequest: end of request');
        this.request.end();
    }
}

class Proxy {

    constructor(host, port) {
        notNull(host, 'host must not be null for proxy mode');
        notNull(host, 'port must not be null for proxy mode');
        Object.assign(this, { host, port });
    }

    createProxyRequest(method, path) {
        const options = {
            port: this.port,
            host: this.host,
            method,
            path
        };

        try {
            debug(`Creating proxied request for ${options}`)
            const req = http.request(options);
            return new ProxyRequest(req);
        } catch (err) {
            error(`error while creating proxied request for ${this.host}:${this.port}`, err);
        }
    }
}

module.exports = { Proxy };