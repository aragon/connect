# ⚡ Aragon Connect

[<img src="https://img.shields.io/github/package-json/v/aragon/connect?label=npm" alt="" />](https://www.npmjs.com/package/@aragon/connect) [<img src="https://img.shields.io/bundlephobia/minzip/@aragon/connect" alt="" />](https://bundlephobia.com/result?p=@aragon/connect) [![codecov](https://codecov.io/gh/aragon/connect/branch/master/graph/badge.svg)](https://codecov.io/gh/aragon/connect)

Note: Aragon Connect is still in active development and its API might change until it reaches 1.0.

## Usage

```js
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

| Name                                              | Description                                                                                 |
| ------------------------------------------------- | ------------------------------------------------------------------------------------------- |
| [connect()](docs/connect.md)                      | Connect to an organization (start here).                                                    |
| [App](docs/app.md)                                | App installed in an organization.                                                           |
| [Connectors](docs/connectors.md)                  | Connectors that fetch data from the chain.                                                  |
| [Intent](docs/intent.md)                          | Intent to change anything on an organization or its apps.                                   |
| [Organization](docs/organization.md)              | Aragon organization.                                                                        |
| [Permission](docs/permission.md)                  | Permission represents the relation between an app role and an entity.                       |
| [Repo](docs/repo.md)                              | App repository.                                                                             |
| [Role](docs/role.md)                              | Single role, which can get assigned to create a permission.                                 |
| [TransactionPath](docs/transaction-path.md)       | Single transaction path.                                                                    |
| [TransactionRequest](docs/transaction-request.md) | Object describing a transaction that can get signed by a library like ethers.js or Web3.js. |

## Packages

| Name                                                                                | Description                                                     | Size                                                                                                                                                                               | Version                                                                                                                                                            |
| ----------------------------------------------------------------------------------- | --------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| [`@aragon/connect`](packages/connect)                                               | The main package. Contains `connect()`.                         | [<img src="https://img.shields.io/bundlephobia/minzip/@aragon/connect" alt="" />](https://bundlephobia.com/result?p=@aragon/connect)                                               | [<img src="https://img.shields.io/github/package-json/v/aragon/connect?label=npm" alt="" />](https://www.npmjs.com/package/@aragon/connect)                        |
| [`@aragon/connect-core`](packages/connect-core)                                     | Core library (used by connectors).                              | [<img src="https://img.shields.io/bundlephobia/minzip/@aragon/connect-core" alt="" />](https://bundlephobia.com/result?p=@aragon/connect-core)                                     | [<img src="https://img.shields.io/github/package-json/v/aragon/connect?label=npm" alt="" />](https://www.npmjs.com/package/@aragon/connect-core)                   |
| [`@aragon/connect-ethereum`](packages/connect-ethereum)                             | Ethereum connector (in progress − included in @aragon/connect). | [<img src="https://img.shields.io/bundlephobia/minzip/@aragon/connect-ethereum" alt="" />](https://bundlephobia.com/result?p=@aragon/connect-ethereum)                             | [<img src="https://img.shields.io/github/package-json/v/aragon/connect?label=npm" alt="" />](https://www.npmjs.com/package/@aragon/connect-ethereum)               |
| [`@aragon/connect-thegraph`](packages/connect-thegraph)                             | TheGraph connector (included in @aragon/connect).               | [<img src="https://img.shields.io/bundlephobia/minzip/@aragon/connect-thegraph" alt="" />](https://bundlephobia.com/result?p=@aragon/connect-thegraph)                             | [<img src="https://img.shields.io/github/package-json/v/aragon/connect?label=npm" alt="" />](https://www.npmjs.com/package/@aragon/connect-thegraph)               |
| [`@aragon/connect-thegraph-voting`](packages/connect-thegraph-voting)               | TheGraph connector for the Voting app.                          | [<img src="https://img.shields.io/bundlephobia/minzip/@aragon/connect-thegraph-voting" alt="" />](https://bundlephobia.com/result?p=@aragon/connect-thegraph-voting)               | [<img src="https://img.shields.io/github/package-json/v/aragon/connect?label=npm" alt="" />](https://www.npmjs.com/package/@aragon/connect-thegraph-voting)        |
| [`@aragon/connect-thegraph-token-manager`](packages/connect-thegraph-token-manager) | TheGraph connector for the Tokens app.                          | [<img src="https://img.shields.io/bundlephobia/minzip/@aragon/connect-thegraph-token-manager" alt="" />](https://bundlephobia.com/result?p=@aragon/connect-thegraph-token-manager) | [<img src="https://img.shields.io/github/package-json/v/aragon/connect?label=npm" alt="" />](https://www.npmjs.com/package/@aragon/connect-thegraph-token-manager) |
