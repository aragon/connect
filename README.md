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

You might want to start by the [Getting Started](https://github.com/aragon/connect/tree/2e8b112b40ab4ec13c7b8ae8fa3bc26caba33d87/docs/guides/getting-started.md) guide.

| Name                                                       | Description                                                                                 |
| :--------------------------------------------------------- | :------------------------------------------------------------------------------------------ |
| [connect\(\)](api-reference/connect.md)                    | Connect to an organization \(start here\).                                                  |
| [App](api-reference/app.md)                                | App installed in an organization.                                                           |
| [Connectors](api-reference/connectors.md)                  | Connectors that fetch data from the chain.                                                  |
| [TransactionIntent](api-reference/transaction-intent.md)   | Intent to change anything on an organization or its apps.                                   |
| [Organization](api-reference/organization.md)              | Aragon organization.                                                                        |
| [Permission](api-reference/permission.md)                  | Permission represents the relation between an app role and an entity.                       |
| [Repo](api-reference/repo.md)                              | App repository.                                                                             |
| [Role](api-reference/role.md)                              | Single role, which can get assigned to create a permission.                                 |
| [TransactionPath](api-reference/transaction-path.md)       | Single transaction path.                                                                    |
| [TransactionRequest](api-reference/transaction-request.md) | Object describing a transaction that can get signed by a library like ethers.js or Web3.js. |

## Packages

| Name                                                                                                                                                                          | Description                                                       | Size                                                                                                                                                               | Version                                                                                                                                            |
| :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :---------------------------------------------------------------- | :----------------------------------------------------------------------------------------------------------------------------------------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------- |
| [`@aragon/connect`](https://github.com/aragon/connect/tree/2e8b112b40ab4ec13c7b8ae8fa3bc26caba33d87/packages/connect/README.md)                                               | The main package. Contains `connect()`.                           | [![](https://img.shields.io/bundlephobia/minzip/@aragon/connect)](https://bundlephobia.com/result?p=@aragon/connect)                                               | [![](https://img.shields.io/github/package-json/v/aragon/connect?label=npm)](https://www.npmjs.com/package/@aragon/connect)                        |
| [`@aragon/connect-core`](https://github.com/aragon/connect/tree/2e8b112b40ab4ec13c7b8ae8fa3bc26caba33d87/packages/connect-core/README.md)                                     | Core library \(used by connectors\).                              | [![](https://img.shields.io/bundlephobia/minzip/@aragon/connect-core)](https://bundlephobia.com/result?p=@aragon/connect-core)                                     | [![](https://img.shields.io/github/package-json/v/aragon/connect?label=npm)](https://www.npmjs.com/package/@aragon/connect-core)                   |
| [`@aragon/connect-ethereum`](https://github.com/aragon/connect/tree/2e8b112b40ab4ec13c7b8ae8fa3bc26caba33d87/packages/connect-ethereum/README.md)                             | Ethereum connector \(in progress − included in @aragon/connect\). | [![](https://img.shields.io/bundlephobia/minzip/@aragon/connect-ethereum)](https://bundlephobia.com/result?p=@aragon/connect-ethereum)                             | [![](https://img.shields.io/github/package-json/v/aragon/connect?label=npm)](https://www.npmjs.com/package/@aragon/connect-ethereum)               |
| [`@aragon/connect-thegraph`](https://github.com/aragon/connect/tree/2e8b112b40ab4ec13c7b8ae8fa3bc26caba33d87/packages/connect-thegraph/README.md)                             | TheGraph connector \(included in @aragon/connect\).               | [![](https://img.shields.io/bundlephobia/minzip/@aragon/connect-thegraph)](https://bundlephobia.com/result?p=@aragon/connect-thegraph)                             | [![](https://img.shields.io/github/package-json/v/aragon/connect?label=npm)](https://www.npmjs.com/package/@aragon/connect-thegraph)               |
| [`@aragon/connect-thegraph-voting`](https://github.com/aragon/connect/tree/2e8b112b40ab4ec13c7b8ae8fa3bc26caba33d87/packages/connect-thegraph-voting/README.md)               | TheGraph connector for the Voting app.                            | [![](https://img.shields.io/bundlephobia/minzip/@aragon/connect-thegraph-voting)](https://bundlephobia.com/result?p=@aragon/connect-thegraph-voting)               | [![](https://img.shields.io/github/package-json/v/aragon/connect?label=npm)](https://www.npmjs.com/package/@aragon/connect-thegraph-voting)        |
| [`@aragon/connect-thegraph-token-manager`](https://github.com/aragon/connect/tree/2e8b112b40ab4ec13c7b8ae8fa3bc26caba33d87/packages/connect-thegraph-token-manager/README.md) | TheGraph connector for the Tokens app.                            | [![](https://img.shields.io/bundlephobia/minzip/@aragon/connect-thegraph-token-manager)](https://bundlephobia.com/result?p=@aragon/connect-thegraph-token-manager) | [![](https://img.shields.io/github/package-json/v/aragon/connect?label=npm)](https://www.npmjs.com/package/@aragon/connect-thegraph-token-manager) |
