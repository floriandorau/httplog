#!/usr/bin/env node
const program = require('commander');

const pkg = require('../package.json');

const ngrok = require('../lib/ngrok');
const server = require('../lib/server');
const { Proxy } = require('../lib/proxy');
const { debug, info, error } = require('../lib/logger');

const actionHandler = async (port, cmd) => {
    info('Welcome to httplog');

    let proxy;
    try {
        if (cmd.ngrok) {
            debug('Run httplog with ngrok');
            await ngrok.start(port);
        }

        if (cmd.proxyMode) {
            [proxyHost, proxyPort] = cmd.proxyMode.split(':');
            debug(`Running httplog server in proxy-mode for '${proxyHost}:${proxyPort}'`);
            proxy = new Proxy(proxyHost, proxyPort);
        }

        server.start(port, { prettify: cmd.prettyPrint, proxy: proxy });
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
    .action(actionHandler)

program.parse(process.argv);