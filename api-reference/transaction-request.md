# TransactionRequest

An object describing a transaction that can get signed by a library like ethers.js or Web3.js, or sent via JSON-RPC.

## Properties

| Name   | Type     | Description                       |
| :----- | :------- | :-------------------------------- |
| `data` | `String` | Transaction data.                 |
| `from` | `String` | Address to use as default sender. |
| `to`   | `String` | Target address or ENS name.       |
