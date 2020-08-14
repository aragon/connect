# Types

This page describes the data types shared that are shared between the different Connect packages.

## `Networkish`

Networkish can be a number, a string or an object.

### As a number

| Type     | Description                                       |
| -------- | ------------------------------------------------- |
| `Number` | [Chain ID](https://chainid.network) of a network. |

### As a string

| Type                              | Description                                                    |
| --------------------------------- | -------------------------------------------------------------- |
| `"ethereum" | "rinkeby" | "xdai"` | Name of a network, from a selection (prefer using a chain ID). |

### As an object

| Name         | Type     | Description                                                                                                               |
| ------------ | -------- | ------------------------------------------------------------------------------------------------------------------------- |
| `chainId`    | `number` | [Chain ID](https://chainid.network) of a network.                                                                         |
| `ensAddress` | `string` | Address of the ENS resolver (optional). If not provided, Connect will attempt to find one that correspond to the chainID. |
| `name`       | `string` | Name of the network. It will be passed to ethers.js internally.                                                           |
