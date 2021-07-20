#!/usr/bin/env node

const program = require('commander');

const pkg = require('../package.json');

const ngrok = require('../lib/ngrok');
const server = require('../lib/server');
const { debug, info, error } = require('../lib/logger');

const { FileHandler } = require('../lib/handler/file-handler');
const { LogRequestHandler } = require('../lib/handler/log-handler');
const { BrowserHandler } = require('../lib/handler/browser-handler');
const { ResponseHandler } = require('../lib/handler/response-handler');
const { ProxyRequestHandler } = require('../lib/handler/proxy-handler');

const actionHandler = async (options) => {
    info('\nWelcome to httplog\n');

    try {

        let ngrokUrl = null;
        if (!options.port) {
            throw new Error('Option port is required');
        }

        if (options.debug) {
            process.debug = true;
        }

        if (options.ngrok) {
            debug('Running httplog with ngrok');
            ngrokUrl = await ngrok.start(options.port);
        }

        const requestHandlers = [
            new LogRequestHandler(),
            new ResponseHandler(options.response)
        ];

        if (options.proxyMode) {
            const [proxyHost, proxyPort] = options.proxyMode.split(':');
            debug(`Running httplog in proxy-mode for '${proxyHost}:${proxyPort}'`);
            requestHandlers.push(new ProxyRequestHandler(proxyHost, proxyPort));
        }

        if (options.file) {
            debug(`Running httplog with file logging '${options.file}'`);
            requestHandlers.push(new FileHandler(options.file));
        }

        if (options.browser) {
            debug('Running httplog in browser-mode');
            requestHandlers.push(new BrowserHandler(ngrokUrl));
        }

        server.start(options.port, requestHandlers);
    } catch (err) {
        error(err.message, err);
        process.exit(1);
    }
};

program
    .version(pkg.version)
    .description(pkg.description)
    .name('httplog')
    .usage('[options]')
    .option('-p, --port <port>', 'Port where to listen for incoming requests')
    .option('-f, --file <file>', 'Pipe http request to <file>')
    .option('-r, --response <file>', 'Provide a mock response from <file>')
    .option('-b, --browser', 'Pipe http requests to your preferred browser')
    .option('-n, --ngrok', 'Exposes httplog to the public internet using ngrok')
    .option('-d, --debug', 'Enable debug logging')
    .option('--proxy-mode <host:port>', '[BETA] Runs httplog in a proxy mode where incoming request will be forwared to "host:port"')
    .action((cmdOpts) => actionHandler(cmdOpts));

program.parse(process.argv);