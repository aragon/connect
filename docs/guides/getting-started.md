# Getting Started with ⚡️ Aragon Connect

## Introduction

Aragon Connect is a suite of tools that allow to integrate Aragon Organizations into apps and websites, providing a unified interface that allows to do all the things that can be done in the Aragon Client and the Aragon Apps: fetching data, subscribing to updates, and generating transactions. It does so by providing default settings that are balanced between performances and decentralization level. It is compatible with web and Node.js environments.

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

### Packages

Aragon Connect consists of a few parts:

- `@aragon/connect`: this is the main library. It provides the main features to connect and interact with organizations, and includes connectors.
- `@aragon/connect-thegraph-voting`: a connector that allows to fetch data from the Voting app, through The Graph.
- `@aragon/connect-thegraph-token-manager`: a connector that allows to fetch data from the Voting app, through The Graph.

[A few other packages](https://github.com/aragon/connect/tree/master/packages) are also published, but they are only needed to author or extend connectors and not to use the library.

## Installation

Start by adding [`@aragon/connect`](https://www.npmjs.com/package/@aragon/connect) to your project:

```console
yarn add @aragon/connect
```

You can now import it:

```js
import { connect } from '@aragon/connect'
```

If you want to interact with the Voting or the Tokens app, you should also install their respective connectors:

```console
yarn add @aragon/connect-thegraph-voting
yarn add @aragon/connect-thegraph-token-manager
```

See “Fetching data from an app state” below to understand how to use these app connectors.

## Connecting to an organization

As seen above, connecting to an organization can be done by calling the `connect()` function.

It requires two parameters:

- The address of the organization, which can be any valid Ethereum address (`0x…`) or [ENS name](https://ens.domains/) (`….eth`).
- The connector we want to use.

```js
const org = await connect('example.aragonid.eth', 'thegraph')
```

It returns an [`Organization`](https://github.com/aragon/connect/blob/master/docs/api/organization.md) instance.

## Connecting to an alternative network

Aragon Connect uses the Ethereum mainnet by default, but other networks can be used instead.

To do so, we use the [Chain ID](https://chainid.network/) assigned to the network:

```js
const org = await connect('example.aragonid.eth', 'thegraph', { chainId: 4 })
```

Note: other than the Ethereum main network (default), only [Rinkeby](https://docs.ethhub.io/using-ethereum/test-networks/#rinkeby) is supported by the `thegraph` connector at the moment.

## Fetching data from an app state

Apps can be obtained from [`Organization`](https://github.com/aragon/connect/blob/master/docs/api/organization.md) instance, but they only contain basic information about apps. Alone, an `App` instance doesn’t provide the state of the app: you need an **app connector** to achieve this.

Let’s see how we can retrieve all the votes from a Voting app:

```js
import { connect } from '@aragon/connect'
import Voting from '@aragon/connect-thegraph-voting'

const org = await connect('example.aragonid.eth', 'thegraph')

// Fetch the apps of the organization
const apps = await org.apps()

// Pick the first Voting app instance
const votingInfo = apps.find(app => app.appName === 'voting.aragonpm.eth')

// Instanciate the Voting app connector using its address:
const voting = new Voting(
  votingInfo.address,
  'https://api.thegraph.com/subgraphs/name/aragon/aragon-voting-mainnet'
)
```

## Subscribing to data updates

It is also possible to subscribe to receive data updates as they arrive.

For example, this is how it can be done for the list of apps:

```js
import { connect } from '@aragon/connect'

const org = await connect('example.aragonid.eth', 'thegraph')

const handler = org.onApps(apps => {
  console.log('Apps updated:', apps)
})
```

The handler can get used to stop receive updates:

```js
const handler = org.onApps(apps => {
  console.log('Apps updated:', apps)
})

// Once handler.unsubscribe() gets called, the callback will stop getting called.
handler.unsubscribe()
```

App connectors also support subscriptions in an identical way:

```js
const voting = new Voting(
  votingInfo.address,
  'https://api.thegraph.com/subgraphs/name/aragon/aragon-voting-mainnet'
)

const handler = voting.onVotes(votes => {
  console.log('Votes updated:', votes)
})

// Stop receiving updates
handler.unsubscribe()
```

## Generating a transaction

Methods ending up in generating a transaction return an [`TransactionIntent`](https://github.com/aragon/connect/blob/master/docs/api/transaction-intent.md) object, that can get used to generate the final transactions from.

Generating a transaction is done in three steps. First, we call a method resulting in a `TransactionIntent` object getting returned:

```js
const intent = await org.appIntent(voting, 'vote', [votes[0].id, true, true])
```

Then we retrieve the path we want, by passing the account that will signing the transaction. Aragon Connect will go through the permissions of the organization, and return all the possible paths:

```js
// The first path is the shortest
const [path] = intent.paths(wallet.account)
```

Finally, we can sign the different transactions associated to this path. Aragon Connect doesn’t handle any signing itself, but return an object that is ready to use with the library of your choice: Web3.js, Ethers, or even a JSON-RPC connection to an Ethereum node.

```js
// We sign the transactions using Ethers here
for (const transaction of path.transactions) {
  await ethers.sendTransaction(transaction)
}
```

## Going further

Once you are familiar with the basics of Aragon Connect, you may want to start exploring the [API documentation](https://github.com/aragon/connect#documentation) and the [examples](https://github.com/aragon/connect/tree/master/examples) provided in the repository.
