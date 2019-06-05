#!/usr/bin/env node
const program = require('commander');

const pkg = require('../package.json');

const ngrok = require('../lib/ngrok');
const server = require('../lib/server');
const { debug, info, error } = require('../lib/logger');
const { LogRequestHandler } = require('../lib/handler/log-handler');
const { ProxyRequestHandler } = require('../lib/handler/proxy-handler');

const actionHandler = async (port, cmd) => {

    info('\nWelcome to httplog\n');

    try {
        if (cmd.debug) {
            process.debug = true;
        }

        if (cmd.ngrok) {
            debug('Running httplog with ngrok');
            await ngrok.start(port);
        }

        const requestHandlers = [];
        requestHandlers.push(new LogRequestHandler(cmd.prettyPrin));

        if (cmd.proxyMode) {
            [proxyHost, proxyPort] = cmd.proxyMode.split(':');
            debug(`Running httplog in proxy-mode for '${proxyHost}:${proxyPort}'`);
            requestHandlers.push(new ProxyRequestHandler(proxyHost, proxyPort));
        }

        server.start(port, requestHandlers);
    } catch (err) {
        error(err.message, err);
        process.exit(1);
    }
};

program
    .version(pkg.version)
    .description(pkg.description)
    .usage('<port> [options] ')
    .option('-n, --ngrok', 'Exposes httplog to the public internet using ngrok')
    .option('-p, --proxy-mode <host:port>', '[BETA] Runs httplog in a proxy mode where incoming request will be forwared to "host:port"')
    .option('-d, --debug', 'Enablee debug logging')
    .action(actionHandler)

program.parse(process.argv);