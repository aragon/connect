# Finance app

This is an app connector for the Finance app (`finance.aragonpm.eth`). It only supports The Graph for now.

## Usage

To connect a Finance app, you need to pass it to `connectFinance()`:

```js
import connect from '@1hive/connect'
import connectFinance from '@1hive/connect-finance'

const org = await connect('myorg.aragonid.eth', 'thegraph')
const finance = await connectFinance(org.app('finance'))
```

It extends the `App` object, which means that every method and property of [`App`](../api-reference/app.md) is also available on this object.

## connect\(app, connector\)

Connects and returns a `Finance` instance.

| Name        | Type                                   | Description                                                                                                                                            |
| ----------- | -------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `app`       | `App` or `Promise<App>`                | The app to extend with connected capabilities.                                                                                                         |
| `connector` | `["thegraph", Object]` or `"thegraph"` | Accepts either a string describing the desired connector (only `"thegraph"` for now), or a tuple to also pass a configuration object to the connector. |
| returns     | `Promise<Finance>`                     | An `Finance` instance (see below).                                                                                                                     |

It can throw the following errors:

| Error type                                                     | Description                                                                                                                 |
| -------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| [`ErrorInvalidApp`](./errors.md#error-invalid-app)             | Either the passed value is not a valid app object, or its name is not `finance`.                                            |
| [`ErrorInvalidConnector`](./errors.md#error-invalid-connector) | Either the connector configuration format is not valid, or the connector name is not supported.                             |
| [`ErrorInvalidNetwork`](./errors.md#error-invalid-network)     | A subgraph couldn’t be found with the current network. Pass a `subgraphUrl` directly, or use one of the supported networks. |

## Finance

An object representing the Finance app, returned by `connectFinance()`. Use the following API to retrieve its data:

### Finance\#transactions\(filters\)

Get the list of transactions in the Finance app.

| Name            | Type                     | Description                                   |
| --------------- | ------------------------ | --------------------------------------------- |
| `filters`       | `Object`                 | Optional object allowing to filter the votes. |
| `filters.first` | `Number`                 | Maximum number of votes. Defaults to `1000`.  |
| `filters.skip`  | `Number`                 | Skip a number of votes. Defaults to `0`.      |
| returns         | `Promise<Transaction[]>` | The list of transactions.                     |

This method can throw one of the following errors:

| Error type                                                     | Description                                 |
| -------------------------------------------------------------- | ------------------------------------------- |
| [`ErrorUnexpectedResult`](./errors.md#error-unexpected-result) | The response seems incorrect.               |
| [`ErrorConnection`](./errors.md#error-connection)              | The connection to the remote source failed. |

### Finance\#onTransactions\(filters, callback\)

Subscribe to the list of transactions in the Finance app. The callback is optional, not passing it will return a partially applied function.

| Name       | Type                                                  | Description                                                                             |
| ---------- | ----------------------------------------------------- | --------------------------------------------------------------------------------------- |
| `filters`  | `Object`                                              | Optional object allowing to filter the votes. See `Finance#transactions()` for details. |
| `callback` | `(error: Error, transactions: Transaction[]) => void` | A callback that will get called every time the result gets updated.                     |
| returns    | `{ unsubscribe: () => void }`                         | Unsubscribe function.                                                                   |

The error passed to `callback` can be `null` (no error) or one of the following:

| Error type                                                     | Description                                 |
| -------------------------------------------------------------- | ------------------------------------------- |
| [`ErrorUnexpectedResult`](./errors.md#error-unexpected-result) | The data couldn’t be fetched.               |
| [`ErrorConnection`](./errors.md#error-connection)              | The connection to the remote source failed. |

### Finance\#balance\(tokenAddress, filters\)

Get the balance of a token in the Finance app.

| Name            | Type                    | Description                                   |
| --------------- | ----------------------- | --------------------------------------------- |
| `tokenAddress`  | `String`                | The address of the token.                     |
| `filters`       | `Object`                | Optional object allowing to filter the votes. |
| `filters.first` | `Number`                | Maximum number of votes. Defaults to `1000`.  |
| `filters.skip`  | `Number`                | Skip a number of votes. Defaults to `0`.      |
| returns         | `Promise<TokenBalance>` | The balance of the token.                     |

This method can throw one of the following errors:

| Error type                                                     | Description                                 |
| -------------------------------------------------------------- | ------------------------------------------- |
| [`ErrorUnexpectedResult`](./errors.md#error-unexpected-result) | The response seems incorrect.               |
| [`ErrorConnection`](./errors.md#error-connection)              | The connection to the remote source failed. |

### Finance\#onBalance\(tokenAddress, filters, callback\)

Subscribe to the balance of a token in the Finance app. The callback is optional, not passing it will return a partially applied function.

| Name           | Type                                            | Description                                                                        |
| -------------- | ----------------------------------------------- | ---------------------------------------------------------------------------------- |
| `tokenAddress` | `String`                                        | The address of the token.                                                          |
| `filters`      | `Object`                                        | Optional object allowing to filter the votes. See `Finance#balance()` for details. |
| `callback`     | `(error: Error, balance: TokenBalance) => void` | A callback that will get called every time the result gets updated.                |
| returns        | `{ unsubscribe: () => void }`                   | Unsubscribe function.                                                              |

The error passed to `callback` can be `null` (no error) or one of the following:

| Error type                                                     | Description                                 |
| -------------------------------------------------------------- | ------------------------------------------- |
| [`ErrorUnexpectedResult`](./errors.md#error-unexpected-result) | The data couldn’t be fetched.               |
| [`ErrorConnection`](./errors.md#error-connection)              | The connection to the remote source failed. |

## TokenBalance

Represents the balance in a given token. It gets returned by `Finance#balance()` for example.

| Name      | Type      | Description                                        |
| --------- | --------- | -------------------------------------------------- |
| `id`      | `String`  | Unique identifier representing this token balance. |
| `token`   | `Address` | Address of the token contract.                     |
| `balance` | `String`  | The actual balance.                                |

## Transaction

| Name         | Type      | Description                                        |
| ------------ | --------- | -------------------------------------------------- |
| `id`         | `String`  | Unique identifier representing this transaction.   |
| `token`      | `Address` | Address of the token contract.                     |
| `entity`     | `Address` | Recipient or sender for the transfer.              |
| `isIncoming` | `Boolean` | Whether the transaction is incoming or outgoing.   |
| `amount`     | `String`  | The amount of tokens transferred.                  |
| `date`       | `String`  | Date of the transfer, in Unix time.                |
| `reference`  | `String`  | An optional reference attached to the transaction. |
