#!/bin/bash

# Arguments
USER=$1
NAME=$2
NETWORK=$3

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

# Prepare subgraph name
FULLNAME=$USER/aragon-$NAME-$NETWORK
if [ "$STAGING" ]; then
  FULLNAME=$FULLNAME-staging
fi
echo ''
echo '> Deploying subgraph: '$FULLNAME

# Deploy subgraph
graph deploy $FULLNAME \
  --ipfs https://api.thegraph.com/ipfs/ \
  --node https://api.thegraph.com/deploy/ \
  --access-token $GRAPHKEY
