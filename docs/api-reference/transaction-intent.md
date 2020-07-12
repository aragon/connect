# TransactionIntent

An intent describing an action in the organization. It provides methods to retrieve the transaction path or the set of transactions necessary for executing the action.

## Methods

### TransactionIntent\#transactions\(account, options\)

Get the transactions to execute for the shortest transaction path.

This is an easier way to do `TransactionIntent.paths(account, options)[0].transactions`

| Name           | Type                            | Description                                                                                               |
| -------------- | ------------------------------- | --------------------------------------------------------------------------------------------------------- |
| `account`      | `String`                        | The account that will sign the transaction.                                                               |
| `options`      | `Object`                        | Options object.                                                                                           |
| `options.as`   | `String`                        | Address of an Aragon organization, or its agent app, through which the paths should get created.          |
| `options.path` | `String[]`                      | An array of address that conform a transaction path, it will be verified without calculating other paths. |
| returns        | `Promise<TransactionRequest[]>` | The transactions corresponding to the shortest transaction path.                                          |

### TransactionIntent\#paths\(account, options\)

Get all the possible transaction paths for a given address. This can be useful to let users pick between multiple paths. Otherwise, `TransactionIntent#transactions()` can be called directly.

| Name           | Type                         | Description                                                                                               |
| -------------- | ---------------------------- | --------------------------------------------------------------------------------------------------------- |
| `account`      | `String`                     | The account that will sign the transaction.                                                               |
| `options`      | `Object`                     | Options object.                                                                                           |
| `options.as`   | `String`                     | Address of an Aragon organization, or its agent app, through which the paths should get created.          |
| `options.path` | `String[]`                   | An array of address that conform a transaction path, it will be verified without calculating other paths. |
| returns        | `Promise<TransactionPath[]>` | Array of all the possible transaction paths.                                                              |
