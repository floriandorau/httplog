const ora = require('ora');
const chalk = require('chalk');
const {info} = require('./logger');

const RequestHandler = class RequestHandler {

    constructor({ prettify = false }) {
        this.prettify = prettify;
    }

    waiting() {
        console.log('')
        this.waitingSpinner = ora({
            text: 'Waiting for requests',
            color: 'green'
        }).start();
    };

    printHeaderData(request) {
        let { method, url } = request;
        
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

        this.printHeaderData(request);

        const dataSpinner = ora('Processing request data').start();

        const data = [];
        request.on('data', (chunk) => data.push(chunk));

        request.on('end', (chunk) => {
            dataSpinner.succeed('Data processed');


            if (request.method === 'POST') {
                if (data.length == 0) {
                    info('post without data');
                } else {
                    info(chalk.gray(data.toString()));
                }
            }

            this.sendResponse(response, 200, 'success');
            this.waiting();
        });
    }
};

module.exports = { RequestHandler };