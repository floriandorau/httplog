#!/usr/bin/env node
const program = require('commander');



const pkg = require('../package.json');

const ngrok = require('../lib/ngrok');
const server = require('../lib/server');
const { info } = require('../lib/logger');

const actionHandler = async (port, cmd) => {
    info('Welcome to httplog');

    try {
        if (cmd.ngrok) {
            await ngrok.start(port);
        }

        server.start(port, { prettify: cmd.prettyPrint });
    } catch (err) {
        console.error(err.message);
        process.exit(1);
    }
};

program
    .version(pkg.version)
    .description(pkg.description)
    .usage('[options] <port>')
    .option('--ngrok', 'Activate ngrok')
    .option('--pretty-print', 'prettify the output')
    .action(actionHandler)

program.parse(process.argv);