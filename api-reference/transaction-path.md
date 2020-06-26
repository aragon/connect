# TransactionPath

Represents a single transaction path.

## Properties

| Name                          | Type                     | Description                                                                    |
| :---------------------------- | :----------------------- | :----------------------------------------------------------------------------- |
| `apps`                        | `App[]`                  | Get all the apps for the path.                                                 |
| `transactionsDescribed`       | `TransactionDescribed[]` | List of transactions in the path with their corresponding radspec description. |
| `destination`                 | `App`                    | Get the destination of the transactions path.                                  |
| `forwardingFeePretransaction` | `TransactionRequest[]`   | Optional pre-transaction, needed with the forwarder fee interface.             |
| `transactions`                | `TransactionRequest[]`   | List of transations in the path, ready to be sent to an Ethereum library.      |
