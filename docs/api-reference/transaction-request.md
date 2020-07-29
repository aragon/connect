# TransactionRequest

An object describing a transaction that can be signed by a library like [ethers.js](https://docs.ethers.io/v5/), [Web3.js](https://web3js.readthedocs.io/en/1.0/), or sent via [JSON-RPC](https://eips.ethereum.org/EIPS/eip-1474).

## Properties

| Name                   | Type                   | Description                                                                                  |
| ---------------------- | ---------------------- | -------------------------------------------------------------------------------------------- |
| `children`             | `TransactionRequest[]` | List of the next transactions in the path.                                                   |
| `descriptionAnnotated` | `Annotation[]`         | List of the Radspec description bindings with the properties `{ type: string, value: any }`. |
| `description`          | `string`               | Radspec description for the transaction.                                                     |
| `data`                 | `String`               | Transaction data.                                                                            |
| `from`                 | `String`               | Address to use as default sender.                                                            |
| `to`                   | `String`               | Target address or ENS name.                                                                  |
