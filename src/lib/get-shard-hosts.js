function getShardHostDetails(host) {
  //  Split out the shard id and hosts.
  const [id, allHosts] = host.split('/');

  //  Split out the individual hosts.
  const hosts = allHosts.split(',');

  return {
    id,
    hosts
  };
}

module.exports = getShardHostDetails;
