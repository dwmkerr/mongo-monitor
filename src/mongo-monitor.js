const { MongoClient } = require('mongodb');
const chalk = require('chalk');
const loadStatus = require('./load-status');
const state = require('./lib/status');
const eventHandlers = require('./lib/event-handlers');
const printConnections = require('./lib/print-connections');

//  Keep track of interesting events.
const events = [];

//  Our single mongo client, which we might take few attempts to establish.
let client = null;

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
    //  If we don't yet have a client, try and create one. Connection issues
    //  might cause this to fail.
    if (client === null) {
      client = await MongoClient.connect(connectionString.toURI());

      Object.keys(eventHandlers).forEach((eventName) => {
        client.topology.on(eventName, (e) => {
          const message = eventHandlers[eventName](e);
          events.push({ time: new Date(), message });
        });
      });
    }
    const status = await loadStatus(client);

    process.stdout.write('\x1Bc');
    console.log(`Time          : ${chalk.white(new Date().toISOString())}`);
    console.log(`Connection    : ${chalk.white(connectionString)}`);
    console.log(`Configuration : ${chalk.white(status.configuration)}`);

    //  If we are standalone, write the number of connections.
    if (status.configuration === 'standalone') {
      console.log(`Connections   : ${printConnections(status.connections.current, status.connections.available)}`);
    }

    //  If we are sharded, write each shard.
    if (status.configuration === 'sharded') {
      status.shards.forEach((shard) => {
        console.log(`\n  Shard: ${chalk.white(shard.id)}    (${printConnections(shard.connections.current, shard.connections.available)} connections)\n`);
        shard.hosts.forEach((host) => {
          console.log(`    ${state.writeStatusNameRightAligned(state.getStatusName(host.state))} : ${chalk.white(host.host)}`);
        });
      });
    }

    //  If we are a replicaset, write each member.
    if (status.configuration === 'replicaset') {
      console.log(`\n  Replicaset: ${chalk.white(status.replsetName)}    (${printConnections(status.connections.current, status.connections.available)} connections)\n`);
      status.members.forEach((m) => {
        console.log(`    ${state.writeStatusNameRightAligned(state.getStatusName(m.state))} : ${chalk.white(m.name)}`);
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
