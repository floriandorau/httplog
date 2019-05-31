const chalk = require('chalk');

const info = (msg)=> {
    console.log(chalk.bold.black(msg));
}

module.exports = {info}