#!/usr/bin/env bash

# Rebuild data and log directories.
if [[ -d './data' ]]; then rm -rf ./data; fi
mkdir ./data
if [[ -d './log' ]]; then rm -rf ./log; fi
mkdir ./log

# Start the standalone process.
mongod --fork --logpath ./log/standalone.log --smallfiles --oplogSize 50 --port 27017 --dbpath ./data 

# Wait a bit of time for the process to start.
sleep 10

# Show the process info.
echo
echo "Standalone MongoDB Running on 27107"
echo
echo "Monitor with: "
echo "  mongo-monitor localhost:27017"
