const ora = require('ora');
const chalk = require('chalk');

const { format } = require('../formatter');
const { info, debug } = require('../logger');
const { redactSecrets } = require('../util');
class LogRequestHandler {

    waiting() {
        this.waitingSpinner = ora({
            prefixText: '\n',
            text: 'Waiting for requests\n',
            color: 'green',
        }).start();
    }

    printHeaderData(method, url, headers) {
        info('# ---- Incoming Request ---- #');
        info(`Received (UTC): ${new Date().toISOString()}`);
        info(`Method:         ${method}`);
        info(`URL:            ${url}`);
        info(`Headers:        ${JSON.stringify(headers, null, 2)}`);
    }

    handleRequest(request) {
        let { method, url, headers } = request;

        this.printHeaderData(method, url, redactSecrets(headers));

        const dataSpinner = ora().start('Processing request data\n');

        const data = [];

        request.on('data', (chunk) => {
            debug(' RequestHandler: Incoming data');
            data.push(chunk);
        });

        request.on('end', () => {
            dataSpinner.succeed('Data processed');

            if (data.length == 0) {
                info('no data');
            } else {
                const formatted = format(headers['content-type'], data.toString());
                info(chalk.green(formatted));
            }

            this.waiting();
        });
    }
}

module.exports = { LogRequestHandler };