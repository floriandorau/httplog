
const util = require('util');
const http = require('http');

const { notNull } = require('../util');
const { debug, error } = require('../logger');

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

class ProxyRequestHandler {

    constructor(host, port) {
        notNull(host, 'host must not be null for proxy mode');
        notNull(host, 'port must not be null for proxy mode');
        Object.assign(this, { host, port });
    }

    handleRequest(request, response) {
        try {
            debug(`proxying request for ${this.host}:${this.port}`)
            const proxyRequest = this._createProxyRequest(request.method, request.url);
            request.on('data', chunk => proxyRequest.write(chunk));
            request.on('end', () => proxyRequest.end());
        } catch (err) {
            error(`error while creating proxied request for ${this.host}:${this.port}`, err);
        }
    }

    // private
    _createProxyRequest(method, path) {
        const options = {
            port: this.port,
            host: this.host,
            method,
            path
        };

        debug(`Creating proxied request with options ${util.inspect(options)}`)
        const req = http.request(options);
        return new ProxyRequest(req);
    }
}

module.exports = { ProxyRequestHandler };