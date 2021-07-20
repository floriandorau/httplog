const http = require('http');

const { info } = require('./logger');

const LISTEN_HOSTNAME = 'localhost';

const start = (port = 8080, requestHandlers) => {
    const server = http.createServer((request, response) =>
        requestHandlers.forEach(requestHandler => requestHandler.handleRequest(request, response)));

    server.listen(port, LISTEN_HOSTNAME, () => info(`http-log is listening on ${LISTEN_HOSTNAME}:${port}`));
};

module.exports = { start };