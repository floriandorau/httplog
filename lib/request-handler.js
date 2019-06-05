const ora = require('ora');
const chalk = require('chalk');

const { info, debug } = require('./logger');

const RequestHandler = class RequestHandler {

    constructor({ prettify = false, proxy }) {
        Object.assign(this, { prettify, proxy });
    }

    waiting() {
        console.log('')
        this.waitingSpinner = ora({
            text: 'Waiting for requests',
            color: 'green'
        }).start();
    };

    printHeaderData(method, url) {
        info('# ---- Incoming Request ---- #');
        info(`Method: ${method}`);
        info(`URL:    ${url}`);
    };

    sendResponse(response, statusCode, msg) {
        response.writeHead(statusCode, { 'Content-Type': 'text/plain' });
        response.end(`${msg}\n`);
    }

    handleRequest(request, response) {
        this.waitingSpinner.succeed();

        let { method, url } = request;

        this.printHeaderData(method, url);

        const dataSpinner = ora('Processing request data').start();

        const data = [];

        const proxyRequest = this.proxy ? this.proxy.createProxiedRequest(method, url) : null;

        request.on('data', (chunk) => {
            data.push(chunk);

            if(proxyRequest) {                
                proxyRequest.write(chunk);
            }
        });

        request.on('end', () => {
            dataSpinner.succeed('Data processed');

            if (request.method === 'POST') {
                if (data.length == 0) {
                    info('post without data');
                } else {
                    info(chalk.gray(data.toString()));
                }
            }

            if(proxyRequest) {
                proxyRequest.end();
            }

            this.sendResponse(response, 200, 'success');
            this.waiting();
        });
    }
};

module.exports = { RequestHandler };