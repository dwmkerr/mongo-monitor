sample-standalone:
	cd ./samples/standalone && ./standalone.sh

sample-replicaset:
	cd ./samples/replicaset && ./replicaset.sh

sample-shard:
	cd ./samples/shard && ./shard.sh

sample-shutdown:
	pgrep -ax mongod | awk '{print $$1}' | xargs kill
	pgrep -ax mongos | awk '{print $$1}' | xargs kill
