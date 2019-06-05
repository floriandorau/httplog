const http = require('http');

const { info } = require('./logger');
const { Proxy } = require('./proxy');
const { RequestHandler } = require('./request-handler');

const LISTEN_HOSTNAME = 'localhost';

const start = (port = 8080, { prettify = false, proxy }) => {
    const requestHandler = new RequestHandler({ proxy });

    const server = http.createServer((request, response) => requestHandler.handleRequest(request, response));

    info(`http-log is listening on ${LISTEN_HOSTNAME}:${port}`);

    requestHandler.waiting();

    server.listen(port, LISTEN_HOSTNAME);
};

module.exports = { start };