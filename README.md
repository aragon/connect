# Aragon Connect [<img height="100" align="right" alt="" src="https://user-images.githubusercontent.com/36158/85128259-d201f100-b228-11ea-9770-76ae86cc98b3.png">](https://connect.aragon.org/)

> a toolkit for developers to seamlessly integrate DAO functionality into apps.

[![](https://img.shields.io/github/package-json/v/aragon/connect?label=npm)](https://www.npmjs.com/package/@aragon/connect) [![](https://img.shields.io/bundlephobia/minzip/@aragon/connect)](https://bundlephobia.com/result?p=@aragon/connect) [![codecov](https://codecov.io/gh/aragon/connect/branch/master/graph/badge.svg)](https://codecov.io/gh/aragon/connect)

_Aragon Connect is still in active development and its API might change until it reaches 1.0._

## Usage

```javascript
// Connects to an organization.
const org = await connect('org.aragonid.eth', 'thegraph')

// Intents can be converted in a transaction.
const intent = await org.removeApp('0x…')

// Get the transactions for the intent with the current account
const transactions = await intent.transactions(wallet.address)

// Sign the generated transactions
for (const transaction of transactions) {
  await ethers.sendTransaction(transaction.toEthers())
}
```

## Documentation

Please have a look at the [documentation website](https://connect.aragon.org/). If you never used the library before, we recommend starting with the [Getting Started](https://connect.aragon.org/guides/getting-started) guide.

## Packages

| Name                                                                  | Description                                                       | Size                                                                                                                                                 | Version                                                                                                                                     |
| :-------------------------------------------------------------------- | :---------------------------------------------------------------- | :--------------------------------------------------------------------------------------------------------------------------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------ |
| [`@aragon/connect`](packages/connect)                                 | The main package. Contains `connect()`.                           | [![](https://img.shields.io/bundlephobia/minzip/@aragon/connect)](https://bundlephobia.com/result?p=@aragon/connect)                                 | [![](https://img.shields.io/github/package-json/v/aragon/connect?label=npm)](https://www.npmjs.com/package/@aragon/connect)                 |
| [`@aragon/connect-core`](packages/connect-core)                       | Core library \(used by connectors\).                              | [![](https://img.shields.io/bundlephobia/minzip/@aragon/connect-core)](https://bundlephobia.com/result?p=@aragon/connect-core)                       | [![](https://img.shields.io/github/package-json/v/aragon/connect?label=npm)](https://www.npmjs.com/package/@aragon/connect-core)            |
| [`@aragon/connect-ethereum`](packages/connect-ethereum)               | Ethereum connector \(in progress − included in @aragon/connect\). | [![](https://img.shields.io/bundlephobia/minzip/@aragon/connect-ethereum)](https://bundlephobia.com/result?p=@aragon/connect-ethereum)               | [![](https://img.shields.io/github/package-json/v/aragon/connect?label=npm)](https://www.npmjs.com/package/@aragon/connect-ethereum)        |
| [`@aragon/connect-thegraph`](packages/connect-thegraph)               | TheGraph connector \(included in @aragon/connect\).               | [![](https://img.shields.io/bundlephobia/minzip/@aragon/connect-thegraph)](https://bundlephobia.com/result?p=@aragon/connect-thegraph)               | [![](https://img.shields.io/github/package-json/v/aragon/connect?label=npm)](https://www.npmjs.com/package/@aragon/connect-thegraph)        |
| [`@aragon/connect-thegraph-voting`](packages/connect-thegraph-voting) | TheGraph connector for the Voting app.                            | [![](https://img.shields.io/bundlephobia/minzip/@aragon/connect-thegraph-voting)](https://bundlephobia.com/result?p=@aragon/connect-thegraph-voting) | [![](https://img.shields.io/github/package-json/v/aragon/connect?label=npm)](https://www.npmjs.com/package/@aragon/connect-thegraph-voting) |
| [`@aragon/connect-thegraph-tokens`](packages/connect-thegraph-tokens) | TheGraph connector for the Tokens app.                            | [![](https://img.shields.io/bundlephobia/minzip/@aragon/connect-thegraph-tokens)](https://bundlephobia.com/result?p=@aragon/connect-thegraph-tokens) | [![](https://img.shields.io/github/package-json/v/aragon/connect?label=npm)](https://www.npmjs.com/package/@aragon/connect-thegraph-tokens) |
