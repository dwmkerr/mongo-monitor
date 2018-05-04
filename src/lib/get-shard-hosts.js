function getShardHostDetails(host) {
  //  If we do not have a slash in the host, then we have a shard which is NOT
  //  a replicaset.
  if (host.indexOf('/') === -1) {
    return {
      replicaSet: null,
      hosts: [ host ] // single host only.
    };
  }

  //  Split out the shard replicaset and hosts.
  const [replicaSet, allHosts] = host.split('/');

  //  Split out the individual hosts.
  const hosts = allHosts.split(',');

  return {
    replicaSet,
    hosts
  };
}

module.exports = getShardHostDetails;
