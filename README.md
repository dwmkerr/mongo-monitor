# mongo-monitor

[![CircleCI](https://circleci.com/gh/dwmkerr/mongo-monitor.svg?style=shield)](https://circleci.com/gh/dwmkerr/mongo-monitor)

Simple CLI to monitor the status of a MongoDB cluster.

```bash
mongo-monitor mongodb://localhost:27017
```

## Usage

The monitor is primary designed to show the status of a MongoDB cluster, updated real-time. This is useful when performing administrative operations such as replicaset or shard configuration.

On a sharded cluster, if you provide a connection string with admin priviledges to any `mongos` host, you will see the sharding configuration:

![TODO: Add sharing screenshot]()

On a replicaset, if you provide a connection string with admin priviledges to any host, or to the entire set, you will see the replicaset configuration:

![TODO: Add replicaset screenshot]()

For a standalone, basic info is reported:

![TODO: Add standalone screenshot]()

## Tests

The following files are useful for testing:

| File | Notes |
|------|-------|
| `shard.isMaster.json` | The output of `isMaster` for a `mongos` member of a sharded cluster. | 
| `shard.listShards.json` | The output of `listShards` for a `mongos` member of a sharded cluster. | 
| `shard.node.isMaster.json` | The output of `isMaster` for a `mongod` member of a sharded cluster. | 

## TODO

- ci
- release
- coverage / tests
- sanitise
- show an activity log (joined/left etc)
- create new seed from this project
- show load balancer status
- use sh.status rather than listShards, so that we get the load balancer status

Command line options and env vars for:
- User
- password
- db
- command line - urlencode the username/password
