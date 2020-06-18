# TransactionRequest

An object describing a transaction that can get signed by a library like ethers.js or Web3.js, or sent via JSON-RPC.

## Properties

| Name | Type | Description |
| :--- | :--- | :--- |
| `chainId` | `Number` | Chain ID of the network. |
| `data` | `String` | Transaction data. |
| `from` | `String` | Address to use as default sender. |
| `gas` | `String` | Price \(in wei\) per unit of gas. Duplicate of `gasPrice`. |
| `gasLimit` | `Number` | Maximum gas this transaction may spend. |
| `gasPrice` | `String` | Price \(in wei\) per unit of gas. |
| `to` | `String` | Target address or ENS name. |
| `value` | `String` | Amount \(in wei\) this transaction is sending. |

