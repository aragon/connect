# Finance app

This is an app connector for the Finance app (`finance.aragonpm.eth`). It only supports The Graph for now.

## Usage

To connect an app, you need to pass a finance app as a first parameter of the connectFinance() function:

```js
import connect from '@aragon/connect'
import connectFinance from '@aragon/connect-finance'

const org = await connect('myorg.aragonid.eth', 'thegraph')
const finance = await connectFinance(org.app('finance'))
```

It extends the `App` object, which means that every method and properties of [`App`](../api-reference/app.md) are also available on this object.

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

### Finance\#onTransactions\(filters, callback\)

Subscribe to the list of transactions in the Finance app. The callback is optional, not passing it will return a partially applied function.

| Name       | Type                                                  | Description                                                                             |
| ---------- | ----------------------------------------------------- | --------------------------------------------------------------------------------------- |
| `filters`  | `Object`                                              | Optional object allowing to filter the votes. See `Finance#transactions()` for details. |
| `callback` | `(error: Error, transactions: Transaction[]) => void` | A callback that will get called every time the result gets updated.                     |
| returns    | `{ unsubscribe: () => void }`                         | Unsubscribe function.                                                                   |

### Finance\#balance\(tokenAddress, filters\)

Get the balance of a token in the Finance app.

| Name            | Type                    | Description                                   |
| --------------- | ----------------------- | --------------------------------------------- |
| `tokenAddress`  | `String`                | The address of the token.                     |
| `filters`       | `Object`                | Optional object allowing to filter the votes. |
| `filters.first` | `Number`                | Maximum number of votes. Defaults to `1000`.  |
| `filters.skip`  | `Number`                | Skip a number of votes. Defaults to `0`.      |
| returns         | `Promise<TokenBalance>` | The balance of the token.                     |

### Finance\#onBalance\(tokenAddress, filters, callback\)

Subscribe to the balance of a token in the Finance app. The callback is optional, not passing it will return a partially applied function.

| Name           | Type                                            | Description                                                                        |
| -------------- | ----------------------------------------------- | ---------------------------------------------------------------------------------- |
| `tokenAddress` | `String`                                        | The address of the token.                                                          |
| `filters`      | `Object`                                        | Optional object allowing to filter the votes. See `Finance#balance()` for details. |
| `callback`     | `(error: Error, balance: TokenBalance) => void` | A callback that will get called every time the result gets updated.                |
| returns        | `{ unsubscribe: () => void }`                   | Unsubscribe function.                                                              |

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
