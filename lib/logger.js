const chalk = require('chalk');

const info = (msg, obj) => {
    console.log(chalk.bold.black(msg));
    if (obj) {
        console.log(obj);
    }
}

const error = (msg, err) => {
    console.log(chalk.bold.red(msg));

    if (err) {
        if (err instanceof Error && process.debug) {
            console.trace(chalk.bold.red(err));
        } else {
            console.dir(err);
        }
    }
};

module.exports = { info, error }