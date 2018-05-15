const { MongoClient } = require('mongodb');
const getShardHosts = require('./lib/get-shard-hosts');

async function getReplicaSetStatus(connectionString) {
  const client = await MongoClient.connect(connectionString);
  const db = client.db('admin');
  const status = await loadReplicasetStatus({ db });
  await client.close();
  return status;
}


async function loadShardedStatus({ db }) {
  //  Get the balancer status and shards.
  //  const balancerStatus = await db.command({ balancerStatus: 1 });
  const balancerStatus = null;
  const listShards = await db.command({ listShards: 1 });

  //  Go through each shard, getting status. This'll be async for each one.
  const promises = listShards.shards.map(async (shard) => {
    //  Get the shard id and hosts.
    const { connectionString, replicaSet, hosts } = getShardHosts(shard.host);

    //  If there is no set name, we're standalone.
    if (!replicaSet) {
      return {
        id: shard._id,
        replicaSet,
        hosts: hosts.map(host => ({ status: '(standalone)', host }))
      };
    }

    //  Try and get the details of the replicaset which make up the shard.
    try {
      const rsStatus = await getReplicaSetStatus(connectionString);

      //  Otherwise, work out the status.
      const shardHosts = rsStatus.members.map((host) => {
      return {
          state: host.state,
          host: host.name
        };
      });

      return { id: shard._id, replicaSet, hosts: shardHosts };
    } catch (err) {
      const shardHosts = hosts.map((host) => {
        return {
          state: -1,
          host
        };
      });
      return { id: shard._id, replicaSet, hosts: shardHosts };
    }
  });

  const shardDetails = await Promise.all(promises);

  //  Return the shard details.
  return {
    configuration: 'sharded',
    balancer: balancerStatus,
    shards: shardDetails
  };
}

async function loadReplicasetStatus({ db }) {
  const status = await db.command({ replSetGetStatus: 1 });

  return {
    configuration: 'replicaset',
    replsetName: status.set,
    members: status.members.map(({ state, name }) => { return { state, name }; })
  };
}

async function loadStandaloneStatus() {
  return {
    configuration: 'standalone'
  };
}

async function loadStatus(client) {
  //  Connect, switch to admin, get the status.
  const db = client.db('admin');
  const isMaster = await db.command({ isMaster: 1 });

  let status;

  //  Are we a sharded cluster?
  if (isMaster.msg === 'isdbgrid') {
    status = await loadShardedStatus({ isMaster, db });
  } else if (isMaster.setName) {
    status = await loadReplicasetStatus({ isMaster, db });
  } else {
    status = await loadStandaloneStatus({ isMaster, db });
  }

  return status;
}

module.exports = loadStatus;
