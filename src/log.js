const chalk = require('chalk');

function info(msg) {
  console.log(chalk.blue(msg));
}

function warn(msg) {
  console.log(chalk.yellow(msg));
}

function error(msg) {
  console.log(chalk.red(msg));
}

module.exports = {
  info,
  warn,
  error
};
