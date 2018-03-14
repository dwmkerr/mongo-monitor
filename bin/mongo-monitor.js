#! /usr/bin/env node
const program = require('commander');
const chalk = require('chalk');
const { ConnectionString } = require('mongo-connection-string');
const pkg = require('../package.json');
const monitor = require('../src/mongo-monitor');

program
  .version(pkg.version, '-v, --version')
  .arguments('<connection-string>')
  .option('-i, --interval <milliseconds>', 'Interval for checking status, default is 1000ms')
  .parse(process.argv);


//  If we have been provided a final arg, it is always just a connection string.
const connectionString = program.args[0];

const interval = Number.parseInt(program.connectionString) || 1000;

if (!connectionString) {
  program.outputHelp();
  process.exit(0);
}

//  Parse the connection string into a ConnectionString object.
const connStr = new ConnectionString(connectionString);

console.log(`Connecting to: ${connStr}`);

monitor({ connectionString: connStr, interval })
  .catch((err) => {
    console.log(chalk.red(`An error occured: ${err.message}`));
    process.exit(1);
  });
