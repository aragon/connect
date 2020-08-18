# TransactionIntent

An intent describing an action in the organization. It provides methods to retrieve the transaction path or the set of transactions necessary for executing the action.

## Methods

### TransactionIntent\#transactions\(account\)

Get the transactions to execute for the shortest transaction path.

This is an easier way to do `TransactionIntent.paths(account)[0].transactions`

| Name           | Type                            | Description                                                                                               |
| -------------- | ------------------------------- | --------------------------------------------------------------------------------------------------------- |
| `account`      | `String`                        | The account that will sign the transaction.                                                               |
| returns        | `Promise<TransactionRequest[]>` | The transactions corresponding to the shortest transaction path.                                          |

### TransactionIntent\#paths\(account\)

Get the shortest transaction path for a given address. Note, `TransactionIntent#transactions()` can be called directly.

| Name           | Type                         | Description                                                                                               |
| -------------- | ---------------------------- | --------------------------------------------------------------------------------------------------------- |
| `account`      | `String`                     | The account that will sign the transaction.                                                               |
| returns        | `Promise<TransactionPath[]>` | Array of all the possible transaction paths.                                                              |
