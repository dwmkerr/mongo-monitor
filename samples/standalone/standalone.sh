#!/usr/bin/env bash

# Basic config.
port=27017

# Rebuild data directories.
if [[ -d './data' ]]; then
    rm -rf ./data
fi
mkdir ./data

# Start the standalone process.
mongod --fork --logpath ./standalone.log --smallfiles --oplogSize 50 --port 27017 --dbpath ./data 

# Wait a bit of time for the process to start.
sleep 10

# Show the process info.
echo
echo "Standalone MongoDB Running on ${port}"
echo
echo "Monitor with: "
echo "  mongo-monitor localhost:${port}"
