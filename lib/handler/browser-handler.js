const open = require('open');
const http = require('http');
const io = require('socket.io');
const getPort = require('get-port');
const serveStatic = require('serve-static');

const ON_DEATH = require('death');

const { join } = require('path');
const { v4: uuidv4 } = require('uuid');

const { format } = require('../formatter');
const { info, debug } = require('../logger');

class BrowserHandler {

    constructor(ngrokUrl = '') {
        this.ngrokUrl = ngrokUrl;

        var serve = serveStatic(join(process.cwd(), 'static'), {
            'index': ['index.html', 'index.htm']
        });

        getPort().then(port => {
            const server = http.createServer((request, response) => serve(request, response));

            info(`Browser is listening on port ${port}`);
            server.listen(port, 'localhost');

            this.socket = io(server);

            this.socket.on('connection', () => {
                debug('Connection established');
                this.connectionEstablished = true;

                if (ngrokUrl) {
                    this.socket.emit('ngrok', ngrokUrl);
                }
            });

            ON_DEATH((signal) => {
                this.socket.close();
                process.exit(signal);
            });

            open(`http://localhost:${port}`);

        });
    }

    print(data) {
        if (this.connectionEstablished) {
            this.socket.emit('data', data);
        }
    }

    printHeaderData(id, { method, url, accept, contentType, contentLength, data }) {
        this.print({ id, receivedTs: new Date(), method, url, contentType, contentLength, accept, data });
    }

    handleRequest(request) {
        const uuid = uuidv4();
        let { method, url, headers } = request;

        this.printHeaderData(uuid, {
            method, url,
            accept: headers['accept'],
            contentType: headers['content-type'],
            contentLength: headers['content-length']
        });

        const data = [];

        request.on('data', (chunk) => data.push(chunk));

        request.on('end', () => {
            const formatted = format(headers['content-type'], data.toString());

            if (request.method === 'POST') {
                if (data.length !== 0) {
                    this.print({ id: uuid, data: formatted });
                }
            }
        });
    }
}

module.exports = { BrowserHandler };