const chalk = require('chalk');

let indentAmount = 0;

function indent(value) {
  indentAmount += value;
}

const indentStr = () => {
  return ''.padStart(indentAmount);
};

function info(msg) {
  console.log(indentStr() + chalk.blue(msg));
}

function warn(msg) {
  console.log(indentStr() + chalk.yellow(msg));
}

function error(msg) {
  console.log(indentStr() + chalk.red(msg));
}

module.exports = {
  indent,
  info,
  warn,
  error
};
