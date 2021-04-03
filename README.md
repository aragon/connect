# Aragon Connect [<img height="100" align="right" alt="" src="https://user-images.githubusercontent.com/36158/85128259-d201f100-b228-11ea-9770-76ae86cc98b3.png">](https://connect.aragon.org/)

> a toolkit for developers to seamlessly integrate DAO functionality into apps.

[![](https://img.shields.io/github/package-json/v/aragon/connect?label=npm)](https://www.npmjs.com/package/@1hive/connect) [![](https://img.shields.io/bundlephobia/minzip/@1hive/connect)](https://bundlephobia.com/result?p=@1hive/connect) [![codecov](https://codecov.io/gh/aragon/connect/branch/master/graph/badge.svg)](https://codecov.io/gh/aragon/connect)

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

Please have a look at the [documentation website](https://connect.aragon.org/). If you never used the library before, we highly recommend starting with the [Getting Started](https://connect.aragon.org/guides/getting-started) guide.

## Packages

| Name                                                   | Description                                        | Size                                                                                                                                 | Version                                                                                                            |
| :----------------------------------------------------- | :------------------------------------------------- | :----------------------------------------------------------------------------------------------------------------------------------- | :----------------------------------------------------------------------------------------------------------------- |
| [`@1hive/connect`](packages/connect)                   | The main package. Contains `connect()`.            | [![](https://img.shields.io/bundlephobia/minzip/@1hive/connect)](https://bundlephobia.com/result?p=@1hive/connect)                   | [![](https://img.shields.io/npm/v/@1hive/connect)](https://www.npmjs.com/package/@1hive/connect)                   |
| [`@1hive/connect-react`](packages/connect-react)       | React API for Connect.                             | [![](https://img.shields.io/bundlephobia/minzip/@1hive/connect-react)](https://bundlephobia.com/result?p=@1hive/connect-react)       | [![](https://img.shields.io/npm/v/@1hive/connect-react)](https://www.npmjs.com/package/@1hive/connect-react)       |
| [`@1hive/connect-core`](packages/connect-core)         | Core library \(used by connectors\).               | [![](https://img.shields.io/bundlephobia/minzip/@1hive/connect-core)](https://bundlephobia.com/result?p=@1hive/connect-core)         | [![](https://img.shields.io/npm/v/@1hive/connect-core)](https://www.npmjs.com/package/@1hive/connect-core)         |
| [`@1hive/connect-thegraph`](packages/connect-thegraph) | TheGraph connector \(included in @1hive/connect\). | [![](https://img.shields.io/bundlephobia/minzip/@1hive/connect-thegraph)](https://bundlephobia.com/result?p=@1hive/connect-thegraph) | [![](https://img.shields.io/npm/v/@1hive/connect-thegraph)](https://www.npmjs.com/package/@1hive/connect-thegraph) |

|
