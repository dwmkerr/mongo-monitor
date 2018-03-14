const chalk = require('chalk');
const longestString = require('./lib/longest-string');
const loadStatus = require('./load-status');

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

//  Keep track of interesting events.
const events = [];

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

function printEvents() {
  //  Finally, write out recent events.
  console.log('\nEvents:');
  const eventCount = 10;
  const start = (events.length - eventCount) > 0 ? (events.length - eventCount) : 0;
  for (let i=events.length - 1; i>=start; --i) {
    const time = events[i].time ? events[i].time.toISOString() : 'unknown';
    console.log(`    ${time} : ${events[i].message}`);
  }
}

async function checkStatus(params) {
  const { connectionString, interval } = params;

  //  Get the cluster status.
  try {
    const status = await loadStatus(connectionString.toURI());

    process.stdout.write('\x1Bc');
    console.log(`Time          : ${chalk.white(new Date().toISOString())}`);
    console.log(`Connection    : ${chalk.white(connectionString)}`);
    console.log(`Configuration : ${chalk.white(status.configuration)}`);

    //  If we are sharded, write each shard.
    if (status.configuration === 'sharded') {
      status.shards.forEach((shard) => {
        console.log(`\n  Shard: ${chalk.white(shard.id)}\n`);
        shard.hosts.forEach((host) => {
          console.log(`    ${writeStatusNameRightAligned(host.status)} : ${chalk.white(host.host)}`);
        });
      });
    }

    //  If we are a replicaset, write each member.
    if (status.configuration === 'replicaset') {
      console.log(`\n  Replicaset: ${chalk.white(status.replsetName)}\n`);
      status.members.forEach((m) => {
        console.log(`    ${writeStatusNameRightAligned(getStatusName(m.state))} : ${chalk.white(m.name)}`);
      });
    }

    printEvents();
  } catch (err) {
    events.push({ time: new Date(), message: err.message });
    process.stdout.write('\x1Bc');
    printEvents();
  } finally {
    //  No matter what happens, try and check again later.
    setTimeout(() => checkStatus(params), interval);
  }
}

async function monitor({ connectionString, interval }) {
  return checkStatus({ connectionString, interval });
}

module.exports = monitor;
