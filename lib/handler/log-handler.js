const ora = require('ora');
const chalk = require('chalk');

const { format } = require('../formatter');
const { info, debug } = require('../logger');

class LogRequestHandler {

    constructor(prettify = false) {
        this.prettify = prettify;
    }

    waiting() {
        this.waitingSpinner = ora({
            prefixText: '\n',
            text: 'Waiting for requests\n',
            color: 'green',
        }).start();
    }

    printHeaderData(method, url, { accept, contentType, contentLength }) {
        info('# ---- Incoming Request ---- #');
        info(`Received (UTC): ${new Date().toISOString()}`);
        info(`Method:         ${method}`);
        info(`URL:            ${url}`);
        info(`content-type:   ${contentType}`);
        info(`content-length: ${contentLength}`);
        info(`accept:         ${accept}`);
    }

    sendResponse(response, statusCode, { accept }) {
        response.writeHead(statusCode, { 'Content-Type': accept || 'text/plain' });
        response.end();
    }

    handleRequest(request, response) {
        let { method, url, headers } = request;

        this.printHeaderData(method, url, {
            accept: headers['accept'],
            contentType: headers['content-type'],
            contentLength: headers['content-length']
        });

        const dataSpinner = ora().start('Processing request data\n');

        const data = [];

        request.on('dta', (chunk) => {
            debug(' RequestHandler: Incoming data');
            data.push(chunk);
        });

        request.on('end', () => {
            debug(' RequestHandler: end of request');
            dataSpinner.succeed('Data processed');

            const formatted = format(headers['content-type'], data.toString());

            if (request.method === 'POST') {
                if (data.length == 0) {
                    info('post without data');
                } else {
                    info(chalk.green(formatted));
                }
            }

            this.sendResponse(response, 200, {
                accept: headers['accept']
            });
            this.waiting();
        });
    }
}

module.exports = { LogRequestHandler };