const chalk = require('chalk');

//  These are the percentage threshholds of current/available
//  at which we use different colours.
const threshholdGreen = 0.4;
const threshholdAmber = 0.7;
// note anything else is red...

/**
 * printConnections - render to a string the number of connections
 * from a set of available connections. Colour coded to indicate
 * whether the number is healthy.
 *
 * The format is "x/y"
 *
 * @param current - the number of currently used connections
 * @param available - the number of available connections
 * @returns {string} - a string ready to print to the console
 */
function printConnections(current, available) {
  if (available === 0) return 'na';

  const utilization = current / available;
  if (utilization <= threshholdGreen)
    return `${chalk.green(current)} / ${chalk.white(available)}`;
  if (utilization <= threshholdAmber)
    return `${chalk.yellow(current)} / ${chalk.white(available)}`;
  return `${chalk.red(current)} / ${chalk.white(available)}`;
}

module.exports = printConnections;
