sample-standalone:
	cd ./samples/standalone && ./standalone.sh

sample-replicaset:
	cd ./samples/replicaset && ./replicaset.sh

sample-shard:
	cd ./samples/shard && ./shard.sh

sample-shutdown:
	ps -ax | grep mongod | awk '{print $$1}' | xargs kill
	ps -ax | grep mongos | awk '{print $$1}' | xargs kill
