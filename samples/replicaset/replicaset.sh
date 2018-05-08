#!/usr/bin/env bash

# Basic config.
port1=27017
port2=27018
port3=27019

# Rebuild data and log directories.
if [[ -d './data' ]]; then
    rm -rf ./data
fi
if [[ -d './log' ]]; then
    rm -rf ./log
fi
mkdir -p ./data/data1
mkdir -p ./data/data2
mkdir -p ./data/data3

# Start the replicaset processes.
mongod --fork --logpath ./log/node1.log --smallfiles --oplogSize 50 --port ${port1} --dbpath ./data/data1 --replSet cluster
mongod --fork --logpath ./log/node2.log --smallfiles --oplogSize 50 --port ${port2} --dbpath ./data/data2 --replSet cluster
mongod --fork --logpath ./log/node3.log --smallfiles --oplogSize 50 --port ${port3} --dbpath ./data/data3 --replSet cluster

# Wait a bit of time for the process to start.
sleep 3

mongo --port 27017 --shell <<- EOF
rs.initiate({
  _id: 'cluster',
  members: [{
    _id: 0,
    host: 'localhost:27017'
  },{
    _id: 1,
    host: 'localhost:27018'
  },{
    _id: 2,
    host: 'localhost:27019',
    arbiterOnly: true
  }]
});
EOF

# Show the process info.
echo
echo "Standalone MongoDB Running on ${port}"
echo
echo "Monitor with: "
echo "  mongo-monitor localhost:${port1},localhost:${port2},localhost:${port3}?replicaSet=cluster"

