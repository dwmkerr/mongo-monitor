const { expect } = require('chai');
const getShardHosts = require('./get-shard-hosts');

describe('get-shard-hosts', () => {
  it('should correctly extract the replicaSet and hosts when a replicaset is present', () => {
    const input = 'replicaSetName/mongo1.shard1.mongo-cluster.com:27017,mongo2.shard1.mongo-cluster.com:27017,mongo3.shard1.mongo-cluster.com:27017';
    const { connectionString, replicaSet, hosts } = getShardHosts(input);
    expect(connectionString).to.equal('mongodb://mongo1.shard1.mongo-cluster.com:27017,mongo2.shard1.mongo-cluster.com:27017,mongo3.shard1.mongo-cluster.com:27017?replicaSet=replicaSetName');
    expect(replicaSet).to.equal('replicaSetName');
    expect(hosts[0]).to.equal('mongo1.shard1.mongo-cluster.com:27017');
    expect(hosts[1]).to.equal('mongo2.shard1.mongo-cluster.com:27017');
    expect(hosts[2]).to.equal('mongo3.shard1.mongo-cluster.com:27017');
  });

  it('should correctly extract the replicaSet and hosts when a replicaset is not present', () => {
    const input = 'mongo1.shard1.mongo-cluster.com:27017';
    const { connectionString, replicaSet, hosts } = getShardHosts(input);
    expect(connectionString).to.equal('mongodb://mongo1.shard1.mongo-cluster.com:27017');
    expect(replicaSet).to.equal(null);
    expect(hosts[0]).to.equal('mongo1.shard1.mongo-cluster.com:27017');
  });
});

