
const ngrok = require('ngrok');

const { notNull } = require('./util');
const { info, error } = require('./logger');

const start = async (port) => {
    notNull(port, 'port is required to use ngrok');

    try {
        info(`Starting ngrok exposing local port ${port}`);
        const url = await ngrok.connect({ proto: 'http', addr: port });

        info(`ngrok created http tunnel at '${url}'`);
        info('You can inspect ngrok traffic at http://127.0.0.1:4040');
        return url;
    } catch (err) {
        error('error while connectiong to ngrok service', err);
    }

    process.on('SIGINT', async () => {
        try {
            await ngrok.kill();
        } catch (err) {
            error('Error trying to kill ngrok', err);
        } finally {
            process.exit();
        }
    });
};

module.exports = { start };