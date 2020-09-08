# Getting started

## Introduction

Aragon Connect is a suite of tools that allow you to easily supercharge apps and websites by integrating them with an Aragon organization. It provides a unified interface for fetching data, subscribing to updates, and generating transactions in the context of Aragon organizations. By default, it balances performance with decentralization, but can be extended and configured to strongly prefer one over the other (if you learn how to do both--let us know!). It is compatible with web and Node.js environments.

This guide assumes that you are familiar with the way Aragon organizations work. If that’s not the case, we invite you to get up to charge with the [Aragon Basics](./aragon-basics.md) guide.

### What does it look like?

This is how to connect to an organization and list its apps:

```javascript
import connect from '@aragon/connect'

// Initiates the connection to an organization
const org = await connect('example.aragonid.eth', 'thegraph')

// Fetch the apps belonging to this organization
const apps = await org.apps()

apps.forEach(console.log)
```

### Connectors

The idea of connectors is central to Aragon Connect. A connector is an abstraction over a data source.

Aragon Connect allows for injecting any type of connector, and includes two by default:

- **The Graph**: fetch data from [Subgraphs](https://thegraph.com/docs/introduction#how-the-graph-works), hosted on [thegraph.com](https://thegraph.com/) by default.
- **Ethereum \(WIP\)**: fetch data from an Ethereum node directly.

A connector can be of two types: **organization** or **app**, to fetch data from one or the other. The main package of Aragon Connect only provides organization connectors: app connectors need to be imported separately.

### Packages

Aragon Connect consists of a few parts:

- `@aragon/connect`: this is the main library. It provides the main features to connect and interact with organizations, and includes the basic organization connectors.
- `@aragon/connect-finance`: an app connector for fetching data from the Finance app.
- `@aragon/connect-voting`: an app connector for fetching data from the Voting app.
- `@aragon/connect-tokens`: an app connector for fetching data from the Tokens app.
- Additional app connectors published by individual app authors

[A few other packages](https://github.com/aragon/connect/tree/master/packages) are also published, but they are only needed to author or extend connectors and not to use the library.

## Installation

Start by adding [`@aragon/connect`](https://www.npmjs.com/package/@aragon/connect) to your project:

```console
yarn add @aragon/connect
```

You can now import it:

```javascript
import connect from '@aragon/connect'
```

If you want to interact with the Finance, Voting or the Tokens app, you should also install their respective connectors:

```text
yarn add @aragon/connect-finance
yarn add @aragon/connect-voting
yarn add @aragon/connect-tokens
```

See [“Fetching an app’s state”](getting-started.md#fetching-an-apps-state) below to understand how to use these app connectors.

## Connecting to an organization

As seen above, connecting to an organization can be done by calling the `connect()` function.

It requires two parameters:

- The address of the organization, which can be any valid Ethereum address \(`0x…`\) or [ENS domain](https://ens.domains/) \(`….eth`\).
- The connector you want to use.

```javascript
const org = await connect('example.aragonid.eth', 'thegraph')
```

It returns an [`Organization`](../api-reference/organization.md) instance.

## Connecting to an alternative network

Aragon Connect connects to the Ethereum mainnet by default, but other networks are also available.

To do so, use the [Chain ID](https://chainid.network/) assigned to the network:

```javascript
// Connect to the Rinkeby test network
const org = await connect('example.aragonid.eth', 'thegraph', { network: 4 })
```

Note: other than the Ethereum main network \(default\), only [Rinkeby](https://docs.ethhub.io/using-ethereum/test-networks/#rinkeby) and [xDAI](https://www.xdaichain.com/) are supported by the `thegraph` connector at the moment.

## Fetching an app’s state

Apps can be obtained from an [`Organization`](../api-reference/organization.md) instance, but they only contain basic information. Alone, an `App` instance doesn’t provide the state of the app: you need an **app connector** to achieve this.

Let’s see how to retrieve all the votes from a Voting app:

```javascript
import connect from '@aragon/connect'
import connectVoting from '@aragon/connect-voting'

const org = await connect('example.aragonid.eth', 'thegraph')

// Connect the Voting app using the corresponding connector:
const voting = connectVoting(org.app('voting'))

// Fetch votes of the Voting app
const votes = await voting.votes()
```

## Subscribing to data updates

It is also possible to subscribe to receive data updates as they arrive.

For example, this is how it can be done for the list of apps:

```javascript
import connect from '@aragon/connect'

const org = await connect('example.aragonid.eth', 'thegraph')

const handler = org.onApps((apps) => {
  console.log('Apps updated:', apps)
})
```

The returned handler can be used to stop receiving updates:

```javascript
const handler = org.onApps((apps) => {
  console.log('Apps updated:', apps)
})

// The callback will stop being called once `handler.unsubscribe()` is called
handler.unsubscribe()
```

App connectors also support subscriptions in an identical way:

```javascript
import connect from '@aragon/connect'
import connectVoting from '@aragon/connect-voting'

const org = await connect('example.aragonid.eth', 'thegraph')
const voting = connectVoting(org.app('voting'))

const handler = voting.onVotes((votes) => {
  console.log('Votes updated:', votes)
})

// Stop receiving updates
handler.unsubscribe()
```

## Generating a transaction

Methods generating a transaction return an [`TransactionIntent`](https://github.com/aragon/connect/blob/master/docs/api/transaction-intent.md) object, that can be used to generate the final transaction for a user to sign.

Generating a transaction is done in three steps. First, call a method returning a `TransactionIntent` object:

```javascript
const intent = org.appIntent(voting, 'vote', [votes[0].id, true, true])
```

Then to retrieve the path you want, pass the account that will be signing the transaction. Aragon Connect will go through the permissions of the organization, and return the shortest path:

```javascript
const path = await intent.paths(wallet.account)
```

Finally, you can sign the different transactions associated to this path. Aragon Connect doesn’t handle any signing itself, but returns an object that is ready to use with the library of your choice: [ethers.js](https://docs.ethers.io/v5/), [Web3.js](https://web3js.readthedocs.io/en/1.0/), or even a [JSON-RPC connection to an Ethereum node](https://eips.ethereum.org/EIPS/eip-1474).


## Going further

Now that you are familiar with the basics of Aragon Connect, you may want to explore the [examples provided in the repository](https://github.com/aragon/connect/tree/master/examples) and the [API documentation](../api-reference/connect.md).

If you are using React, you might want to have a look at the [Usage with React](connect-with-react.md) guide.
