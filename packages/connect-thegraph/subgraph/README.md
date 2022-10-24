# Aragon Subgraph

This is a subgraph for the [Aragon Project](https://github.com/aragon).

## Brief Description of The Graph Node Setup

A Graph Node can run multiple subgraphs, and in this case it can have a subgraph for Mainnet and testnets. The subgraph ingests event data by calling to Infura through http. It can also connect to any geth node or parity node that accepts RPC calls (such as a local one). Fast synced geth nodes do work. To use parity, the `--no-warp` flag must be used. Setting up a local Ethereum node is more reliable and faster, but Infura is the easiest way to get started.

These subgraphs has three types of files which tell the Graph Node to ingest events from specific contracts. They are:

- The subgraph manifest (subgraph.yaml)
- A GraphQL schema (schema.graphql)
- Mapping scripts (ACL.ts, constants.ts, Kernel.ts, DAOFactory.ts)

This repository has these files created and ready to compile, so a user can start this subgraph on their own. The only thing that needs to be edited is the contract addresses in the `subgraph.yaml` file to change between Goerli or Mainnet `DAOFactory`.

### Local setup

To test the subgraph locally please do the following tasks

##### 1. Install aragonCLI and The Graph and local dependencies

First make sure you have both Ganache and Graph CLIs, and install project dependencies:

```bash
  npm install -g @aragon/cli
  npm install -g @graphprotocol/graph-cli
  npm i
```

##### 2. Start aragen node

Start a local aragen in a separate terminal with the following params:

```bash
  aragon devchain --verbose
```

##### 3. Start Graph node

In another terminal, clone the graph node and start it:

```bash
  git clone https://github.com/graphprotocol/graph-node/
  cd graph-node/docker
  rm -rf data
  ./setup.sh
  docker-compose up
```

(See [this issue](https://github.com/graphprotocol/graph-node/issues/1132) about the `setup.sh` script)

> If docker prompts you with the error `The reorg threshold 50 is larger than the size of the chain 7, you probably want to set the ETHEREUM_REORG_THRESHOLD environment variable to 0`,
> simply add a new env variable in `docker-compose.yml` named `ETHEREUM_REORG_THRESHOLD` assigning it to 0 and start it again.

## Viewing the Subgraph on the Graph Hosted Service

This subgraph is not yet on [The Graph Explorer](https://thegraph.com/explorer/). To understand how deploying to the hosted service works, check out the [Deploying Instructions](https://thegraph.com/docs/deploy-a-subgraph) in the official documentation. The most important part of deploying to the hosted service is ensuring that the npm script for `deploy` is updated to the correct name that you want to deploy with.

## Getting started with Querying

Below shows all the ways to query a Individual Subgraph and the network subgraph

### Querying all possible data that is being stored

The query below shows all the information that is possible to query, but is limited to the first 5 instances. Limiting to 5 or 10 instances is good, because with no limit tens of thousands of results can be queried at once, which can be slow on your computer. There are many other filtering options that can be used, just check out the [querying api](https://github.com/graphprotocol/graph-node/blob/master/docs/graphql-api.md). Also check out the [GraphQL docs](https://graphql.org/learn/) if you are completely new to GraphQL and the info in this section doesn't make sense.

#### Query example

```graphql
{
  kernels(first: 5) {
    id
    acl {
      id
    }
    appsProxies {
      id
      appID
    }
  }
}
```

The command above can be copy pasted into the Graphiql interface in your browser at `127.0.0.1:8000`.
