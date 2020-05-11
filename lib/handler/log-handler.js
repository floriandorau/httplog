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

    printHeaderData(method, url, { contentType, contentLength }) {
        info('# ---- Incoming Request ---- #');
        info(`Method:         ${method}`);
        info(`URL:            ${url}`);
        info(`content-type:   ${contentType}`);
        info(`content-length: ${contentLength}`);
    }

    sendResponse(response, statusCode, msg) {
        response.writeHead(statusCode, { 'Content-Type': 'text/plain' });
        response.end(`${msg}\n`);
    }

    handleRequest(request, response) {
        let { method, url, headers } = request;

        this.printHeaderData(method, url, {
            contentType: headers['content-type'],
            contentLength: headers['content-length']
        });

        const dataSpinner = ora({
            test: 'Processing request data\n'
        }).start();

        const data = [];

        request.on('data', (chunk) => {
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

            this.sendResponse(response, 200, 'success');
            this.waiting();
        });
    }
}

module.exports = { LogRequestHandler };