const { expect } = require('chai');
const getShardHosts = require('./get-shard-hosts');

describe('get-shard-host-details', () => {
  it('should correctly extract the id and hosts', () => {
    const input = 'shardname/mongo1.shard1.mongo-cluster.com:27017,mongo2.shard1.mongo-cluster.com:27017,mongo3.shard1.mongo-cluster.com:27017';
    const { id, hosts } = getShardHosts(input);
    expect(id).to.equal('shardname');
    expect(hosts[0]).to.equal('mongo1.shard1.mongo-cluster.com:27017');
    expect(hosts[1]).to.equal('mongo2.shard1.mongo-cluster.com:27017');
    expect(hosts[2]).to.equal('mongo3.shard1.mongo-cluster.com:27017');
  });
});

