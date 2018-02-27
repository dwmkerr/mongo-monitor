const chalk = require('chalk');
const { MongoClient } = require('mongodb');
const log = require('./log');

const stateMap = {
  0: 'STARTUP',
  1: 'PRIMARY',
  2: 'SECONDARY',
  3: 'RECOVERING',
  5: 'STARTUP',
  6: 'UNKNOWN',
  7: 'ARBITER',
  8: 'DOWN',
  9: 'ROLLBACK',
  10: 'REMOVED'
};

async function checkStatus(db, interval) {
  const status = await db.command({ replSetGetStatus: 1 });

  //  Get replicaset set data.
  const replsetName = status.set;
  const myStatusName = stateMap[status.myState];

  console.log('\x1Bc');
  debugger;
  console.log(`Time      : ${chalk.white(new Date().toISOString())}`);
  console.log(`Replicaset: ${replsetName}`);
  console.log(`My Status : ${myStatusName}`);

  status.members.forEach((m) => {
    console.log(`${m.name}: ${m.stateStr}`);
  });

  setInterval(() => checkStatus(db, interval), interval);
}

async function monitor({ connectionString, interval }) {
  // Connect to the db
  const client = await MongoClient.connect(connectionString);
  const db = client.db('admin');

  checkStatus(db, interval);
}

module.exports = monitor;
