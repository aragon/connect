# Tokens app

This is an app connector for the Tokens app (`token-manager.aragonpm.eth`). It only supports The Graph for now.

## Usage

To connect a Tokens app, you need to pass it to `connectTokens()`:

```js
import connect from '@1hive/connect'
import connectTokens from '@1hive/connect-tokens'

const org = await connect('myorg.aragonid.eth', 'thegraph')
const tokens = await connectTokens(org.app('token-manager'))
```

It extends the `App` object, which means that every method and property of [`App`](../api-reference/app.md) is also available on this object.

## connect\(app, connector\)

Connects and returns a `Tokens` instance.

| Name        | Type                                   | Description                                                                                                                                            |
| ----------- | -------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `app`       | `App` or `Promise<App>`                | The app to extend with connected capabilities.                                                                                                         |
| `connector` | `["thegraph", Object]` or `"thegraph"` | Accepts either a string describing the desired connector (only `"thegraph"` for now), or a tuple to also pass a configuration object to the connector. |
| returns     | `Promise<Tokens>`                      | An `Tokens` instance (see below).                                                                                                                      |

It can throw the following errors:

| Error type                                                     | Description                                                                                                                 |
| -------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| [`ErrorInvalidApp`](./errors.md#error-invalid-app)             | Either the passed value is not a valid app object, or its name is not `token-manager`.                                      |
| [`ErrorInvalidConnector`](./errors.md#error-invalid-connector) | Either the connector configuration format is not valid, or the connector name is not supported.                             |
| [`ErrorInvalidNetwork`](./errors.md#error-invalid-network)     | A subgraph couldn’t be found with the current network. Pass a `subgraphUrl` directly, or use one of the supported networks. |

## Tokens

An object representing the Tokens app, returned by `connectTokens()`. Use the following API to retrieve its data:

### Tokens\#token\(\)

Get the `Token` instance used with the app.

| Name    | Type             | Description       |
| ------- | ---------------- | ----------------- |
| returns | `Promise<Token>` | A `Token` object. |

This method can throw one of the following errors:

| Error type                                                     | Description                                 |
| -------------------------------------------------------------- | ------------------------------------------- |
| [`ErrorUnexpectedResult`](./errors.md#error-unexpected-result) | The response seems incorrect.               |
| [`ErrorConnection`](./errors.md#error-connection)              | The connection to the remote source failed. |

### Tokens\#holders\(filters\)

Get a list of token holders.

| Name            | Type                     | Description                                           |
| --------------- | ------------------------ | ----------------------------------------------------- |
| `filters`       | `Object`                 | Optional object allowing to filter the token holders. |
| `filters.first` | `Number`                 | Maximum number of token holders. Defaults to `1000`.  |
| `filters.skip`  | `Number`                 | Skip a number of token holders. Defaults to `0`.      |
| returns         | `Promise<TokenHolder[]>` | List of token holders.                                |

This method can throw one of the following errors:

| Error type                                                     | Description                                 |
| -------------------------------------------------------------- | ------------------------------------------- |
| [`ErrorUnexpectedResult`](./errors.md#error-unexpected-result) | The response seems incorrect.               |
| [`ErrorConnection`](./errors.md#error-connection)              | The connection to the remote source failed. |

### Tokens\#onHolders\(filters, callback\)

Subscribe to a list of token holders. The callback is optional, not passing it will return a partially applied function.

| Name       | Type                                                  | Description                                                                               |
| ---------- | ----------------------------------------------------- | ----------------------------------------------------------------------------------------- |
| `filters`  | `Object`                                              | Optional object allowing to filter the token holders. See `Tokens#holders()` for details. |
| `callback` | `(error: Error, tokenHolders: TokenHolder[]) => void` | A callback that will get called every time the result gets updated.                       |
| returns    | `{ unsubscribe: () => void }`                         | Unsubscribe function.                                                                     |

The error passed to `callback` can be `null` (no error) or one of the following:

| Error type                                                     | Description                                 |
| -------------------------------------------------------------- | ------------------------------------------- |
| [`ErrorUnexpectedResult`](./errors.md#error-unexpected-result) | The data couldn’t be fetched.               |
| [`ErrorConnection`](./errors.md#error-connection)              | The connection to the remote source failed. |

## Token

This object represents the token contract (based on [MiniMe](https://github.com/Giveth/minime)) used by the Tokens app. It gets returned by `Tokens#token()` for example.

| Name           | Type      | Description                                                               |
| -------------- | --------- | ------------------------------------------------------------------------- |
| `id`           | `String`  | Unique identifier representing this token.                                |
| `address`      | `Address` | Address of the [MiniMe Token contract](https://github.com/Giveth/minime). |
| `name`         | `String`  | The token name (e.g. “Aragon Network Token”).                             |
| `symbol`       | `String`  | The token symbol (e.g. “ANT”).                                            |
| `totalSupply`  | `String`  | The total supply for the token.                                           |
| `transferable` | `Boolean` | Whether the token is transferable.                                        |

## TokenHolder

This object represents a single token holder. It gets returned by `Tokens#holders()` for example.

| Name      | Type      | Description                                      |
| --------- | --------- | ------------------------------------------------ |
| `id`      | `String`  | Unique identifier representing the token holder. |
| `address` | `Address` | Address of the token holder.                     |
| `balance` | `String`  | Current balance.                                 |
