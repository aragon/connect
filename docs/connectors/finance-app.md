# Finance app

This is an app connector for the Finance app (`finance.aragonpm.eth`). It only supports The Graph for now.

## API

To connect an app, you need to pass a finance app as a first parameter of the connectFinance() function:

```js
import connect from '@aragon/connect'
import connectFinance from '@aragon/connect-finance'

const org = connect('myorg.aragonid.eth', 'thegraph')
const finance = await connectFinance(org.app('finance'))
```

It extends the `App` object, which means that every method and properties of [`App`](../api-reference/app.md) are also available on this object.

Once you have a `Finance` instance, you can use the following API to retrieve its data:

### Finance\#transactions\(filters\)

Get the list of transactions in the Finance app.

| Name            | Type                     | Description                                   |
| --------------- | ------------------------ | --------------------------------------------- |
| `filters`       | `Object`                 | Optional object allowing to filter the votes. |
| `filters.first` | `Number`                 | Maximum number of votes. Defaults to `1000`.  |
| `filters.skip`  | `Number`                 | Skip a number of votes. Defaults to `0`.      |
| returns         | `Promise<Transaction[]>` | The list of transactions.                     |

### Finance\#onTransactions\(filters, callback\)

Subscribe to the list of transactions in the Finance app.

| Name            | Type                   | Description                                                         |
| --------------- | ---------------------- | ------------------------------------------------------------------- |
| `filters`       | `Object`               | Optional object allowing to filter the votes.                       |
| `filters.first` | `Number`               | Maximum number of votes. Defaults to `1000`.                        |
| `filters.skip`  | `Number`               | Skip a number of votes. Defaults to `0`.                            |
| `callback`      | `transactions => void` | A callback that will get called every time the result gets updated. |
| returns         | `Function`             | Unsubscribe function.                                               |

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

Subscribe to the balance of a token in the Finance app.

| Name            | Type              | Description                                                         |
| --------------- | ----------------- | ------------------------------------------------------------------- |
| `tokenAddress`  | `String`          | The address of the token.                                           |
| `filters`       | `Object`          | Optional object allowing to filter the votes.                       |
| `filters.first` | `Number`          | Maximum number of votes. Defaults to `1000`.                        |
| `filters.skip`  | `Number`          | Skip a number of votes. Defaults to `0`.                            |
| `callback`      | `balance => void` | A callback that will get called every time the result gets updated. |
| returns         | `Function`        | Unsubscribe function.                                               |
