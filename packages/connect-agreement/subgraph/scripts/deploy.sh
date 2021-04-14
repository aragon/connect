#!/bin/bash

# Arguments
NETWORK=$1

# Require $GRAPHKEY to be set
if [[ -z "${GRAPHKEY}" ]]; then
>&2 echo "Please set \$GRAPHKEY to your The Graph access token to run this command."
exit 1
fi

# Build manifest
echo ''
echo '> Building manifest file subgraph.yaml'
./scripts/build-manifest.sh $NETWORK

# Generate types
echo ''
echo '> Generating types'
graph codegen

echo Deploying subgraph 1hive/agreement-$NETWORK

GRAPH_NODE="https://api.thegraph.com/deploy/"
IPFS_NODE="https://api.thegraph.com/ipfs/"

# Deploy subgraph
graph deploy 1hive/agreement-$NETWORK --ipfs ${IPFS_NODE} --node ${GRAPH_NODE} --access-token ${GRAPHKEY}
