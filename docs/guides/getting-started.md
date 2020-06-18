# Getting Started with ⚡️ Aragon Connect

## Introduction

Aragon Connect is a suite of tools that allow to integrate Aragon Organizations into apps and websites, providing a unified interface that allows to do all the things that can be done in the Aragon Client and the Aragon Apps: fetching data, subscribing to updates, and generating transactions. It does so by providing default settings that are balanced between performances and decentralization level.

### What does it look like?

This is how we can connect to an organization and list its apps:

```js
import { connect } from '@aragon/connect'

// Initiates the connection to an organization.
const org = await connect('example.aragonid.eth', 'thegraph')

// Fetch the apps belonging to this organization.
const apps = await org.apps()

apps.forEach(console.log)
```

### Connectors

The idea of connectors is central to Aragon Connect. A connector is an abstracted way to fetch data from a given source.

Aragon Connect allows to inject any type of connector, and includes two by default:

- **The Graph**: fetch data from [subgraphs](https://thegraph.com/docs/introduction#how-the-graph-works), hosted on [thegraph.com](https://thegraph.com/) by default.
- **Ethereum (WIP)**: fetch data from an Ethereum node directly.

A connector can be of two types: organization or app, to fetch data from one or the other. The main package of Aragon Connect only provides organization connectors: app connectors need to be imported separately.

### Libraries

Aragon Connect consists of a few parts:

- `@aragon/connect`: this is the main library. It provides the main features to connect and interact with organizations, and includes connectors.
- `@aragon/connect-thegraph-voting`: a connector that allows to fetch data from the Voting app, through The Graph.
- `@aragon/connect-thegraph-token-manager`: a connector that allows to fetch data from the Voting app, through The Graph.

[A few other packages](https://github.com/aragon/connect/tree/master/packages) are also published, but they are only needed to author or extend connectors and not to use the library.

## Mini cookbook

What follows is a list of common tasks and how they can be achieved with Aragon Connect.

### Connecting to an organization

As seen above, connecting to an organization can be done by calling the `connect()` function.

It requires two parameters:

- The address of the organization, which can be any valid Ethereum address (`0x…`) or [ENS name](https://ens.domains/) (`….eth`).
- The connector we want to use.

```js
const org = await connect('example.aragonid.eth', 'thegraph')
```

It returns an [`Organization`](https://github.com/aragon/connect/blob/master/docs/api/organization.md) instance.

### Connecting to an alternative network

Aragon Connect uses the Ethereum mainnet by default, but other networks can be used instead.

To do so, we use the [Chain ID](https://chainid.network/) assigned to the network:

```js
const org = await connect('example.aragonid.eth', 'thegraph', { chainId: 4 })
```

Note: only [Rinkeby](https://docs.ethhub.io/using-ethereum/test-networks/#rinkeby) is supported by the `thegraph` connector at the moment.

### Fetching votes from the Voting app

### Subscribing to data updates

### Generating a transaction

## API Reference

Once you are familiar with the basics of Aragon Connect, you may want to start exploring the [API documentation](https://github.com/aragon/connect#documentation).
