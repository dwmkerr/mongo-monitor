#!/usr/bin/env bash

# Rebuild data and log directories.
if [[ -d './data' ]]; then
    rm -rf ./data
fi
if [[ -d './log' ]]; then
    rm -rf ./log
fi
mkdir -p ./data/datacs1
mkdir -p ./data/datacs2
mkdir -p ./data/datacs3
mkdir -p ./data/datars1a
mkdir -p ./data/datars1b
mkdir -p ./data/datars1c
mkdir -p ./data/datars1d
mkdir -p ./data/datars2a
mkdir -p ./data/datars2b
mkdir -p ./data/datars2c
mkdir -p ./data/datars3a
mkdir -p ./data/datars3b
mkdir -p ./data/datars3c
mkdir -p ./log

# Start the config servers.
mongod --fork --logpath ./log/cs1.log --oplogSize 50 --port 27117 --dbpath ./data/datacs1 --configsvr --replSet config
mongod --fork --logpath ./log/cs2.log --oplogSize 50 --port 27118 --dbpath ./data/datacs2 --configsvr --replSet config
mongod --fork --logpath ./log/cs3.log --oplogSize 50 --port 27119 --dbpath ./data/datacs3 --configsvr --replSet config

# Start the replicasets.
mongod --fork --bind_ip_all --replSet rs1 --port 27217 --dbpath ./data/datars1a --logpath ./log/rs1a.log --shardsvr
mongod --fork --bind_ip_all --replSet rs1 --port 27218 --dbpath ./data/datars1b --logpath ./log/rs1b.log --shardsvr
mongod --fork --bind_ip_all --replSet rs1 --port 27219 --dbpath ./data/datars1c --logpath ./log/rs1c.log --shardsvr
mongod --fork --bind_ip_all --replSet rs1 --port 27220 --dbpath ./data/datars1d --logpath ./log/rs1d.log --shardsvr
mongod --fork --bind_ip_all --replSet rs2 --port 27317 --dbpath ./data/datars2a --logpath ./log/rs2a.log --shardsvr
mongod --fork --bind_ip_all --replSet rs2 --port 27318 --dbpath ./data/datars2b --logpath ./log/rs2b.log --shardsvr
mongod --fork --bind_ip_all --replSet rs2 --port 27319 --dbpath ./data/datars2c --logpath ./log/rs2c.log --shardsvr
mongod --fork --bind_ip_all --replSet rs3 --port 27417 --dbpath ./data/datars3a --logpath ./log/rs3a.log --shardsvr
mongod --fork --bind_ip_all --replSet rs3 --port 27418 --dbpath ./data/datars3b --logpath ./log/rs3b.log --shardsvr
mongod --fork --bind_ip_all --replSet rs3 --port 27419 --dbpath ./data/datars3c --logpath ./log/rs3c.log --shardsvr

# Wait a bit of time for the process to start.
sleep 3

# Initial the replicasets.
mongo --port 27117 --shell <<- EOF
rs.initiate({
  _id: 'config',
  members: [{
    _id: 0,
    host: 'localhost:27117'
  },{
    _id: 1,
    host: 'localhost:27118'
  },{
    _id: 2,
    host: 'localhost:27119'
  }]
});
EOF
mongo --port 27217 --shell <<- EOF
rs.initiate({
  _id: 'rs1',
  members: [{
    _id: 0,
    host: 'localhost:27217'
  },{
    _id: 1,
    host: 'localhost:27218'
  },{
    _id: 2,
    host: 'localhost:27219',
    arbiterOnly: true
  }]
});
EOF
mongo --port 27318 --shell <<- EOF
rs.initiate({
  _id: 'rs2',
  members: [{
    _id: 0,
    host: 'localhost:27317'
  },{
    _id: 1,
    host: 'localhost:27318'
  },{
    _id: 2,
    host: 'localhost:27319'
  }]
});
EOF
mongo --port 27419 --shell <<- EOF
rs.initiate({
  _id: 'rs3',
  members: [{
    _id: 0,
    host: 'localhost:27417'
  },{
    _id: 1,
    host: 'localhost:27418'
  },{
    _id: 2,
    host: 'localhost:27419'
  }]
});
EOF

# Start the sharding process.
mongos --logpath ./log/shard.log --fork --bind_ip_all --configdb "config/localhost:27117,localhost:27118,localhost:27119"
mongo --shell <<- EOF
sh.addShard("rs1/localhost:27217,localhost:27218,localhost:27219")
sh.addShard("rs2/localhost:27317,localhost:27318,localhost:27319")
sh.addShard("rs3/localhost:27417,localhost:27418,localhost:27419")
EOF

# Show the process info.
echo
echo "Sharded MongoDB Cluster Running"
echo
echo "Monitor with: "
echo "  mongo-monitor localhost"

