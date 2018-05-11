const chalk = require('chalk');
const longestString = require('./longest-string');

const stateMap = [
  { code: 0, name: 'STARTUP', colour: 'yellow' },
  { code: 1, name: 'PRIMARY', colour: 'green' },
  { code: 2, name: 'SECONDARY', colour: 'blue' },
  { code: 3, name: 'RECOVERING', colour: 'yellow' },
  { code: 5, name: 'STARTUP', colour: 'yellow' },
  { code: 6, name: 'UNKNOWN', colour: 'red' },
  { code: 7, name: 'ARBITER', colour: 'magenta' },
  { code: 8, name: 'DOWN', colour: 'red' },
  { code: 9, name: 'ROLLBACK', colour: 'yellow' },
  { code: 10, name: 'REMOVED', colour: 'red' }
];

function getStatusName(stateCode) {
  const state = stateMap.find(sm => sm.code === stateCode);
  if (!state) return 'UNKNOWN';
  return state.name;
}

function writeStatusName(statusName, padLeft = 0) {
  const state = stateMap.find(sm => sm.name === statusName);
  if (!state) return chalk.red('unknown');
  return chalk[state.colour](state.name.padStart(padLeft));
}

function writeStatusNameRightAligned(statusName) {
  const l = longestString(stateMap.map(s => s.name));
  return writeStatusName(statusName, l);
}

module.exports = {
  getStatusName,
  writeStatusName,
  writeStatusNameRightAligned
};
