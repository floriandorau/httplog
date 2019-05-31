const ngrok = require('ngrok');

const start = async (port) => {
    if (!port) {
        throw new Error('ngrok port must be defined');
    }

    console.log(`starting ngrok with port ${port}`);

    try {
        const url = await ngrok.connect({ proto: 'http', addr: port })
        console.log(`ngrork created at ${url}`)
        console.log('got to http://127.0.0.1:4040 to inspect ngrok');   
    } catch(err) {
        console.error(err);
    }

    process.on('SIGINT', async () => {
        try {
            await ngrok.kill();
        } catch (err) {
            console.error('errorr while trying to kill ngrok', err);
        } finally {
            process.exit();
        }
    });
};

module.exports = { start };