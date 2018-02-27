#! /usr/bin/env node
const program = require('commander');
const chalk = require('chalk');
const pkg = require('../package.json');
const monitor = require('../src/monitor.js');

program
  .version(pkg.version, '-v, --version')
  .option('-c, --connection-string <string>', 'Specfiy the connection string, default is localhost')
  .option('-i, --interval <milliseconds>', 'Interval for checking status, default is 1000ms')
  .parse(process.argv);

const connectionString = program.connectionString || 'mongodb://localhost';
const interval = Number.parseInt(program.connectionString) || 1000;

console.log(`Connecting to: ${connectionString}`);

monitor({ connectionString, interval })
  .catch((err) => {
    console.log(chalk.red(`An error occured: ${err.message}`));
  });
