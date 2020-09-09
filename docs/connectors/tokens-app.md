# Tokens app

This is an app connector for the Tokens app (`token-manager.aragonpm.eth`). It only supports The Graph for now.

## Usage

To create a new instance of the connector, you need the specific Tokens app address and a Subgraph URL:

```js
import connect from '@aragon/connect'
import connectTokens from '@aragon/connect-tokens'

const org = await connect('myorg.aragonid.eth', 'thegraph')
const tokens = await connectTokens(org.app('token-manager'))
```

It extends the `App` object, which means that every method and properties of [`App`](../api-reference/app.md) are also available on this object.

## Tokens

An object representing the Tokens app, returned by `connectTokens()`. Use the following API to retrieve its data:

### Tokens\#token\(\)

Get the `Token` instance used with the app.

| Name    | Type             | Description       |
| ------- | ---------------- | ----------------- |
| returns | `Promise<Token>` | A `Token` object. |

### Tokens\#holders\(filters\)

Get a list of token holders.

| Name            | Type                     | Description                                           |
| --------------- | ------------------------ | ----------------------------------------------------- |
| `filters`       | `Object`                 | Optional object allowing to filter the token holders. |
| `filters.first` | `Number`                 | Maximum number of token holders. Defaults to `1000`.  |
| `filters.skip`  | `Number`                 | Skip a number of token holders. Defaults to `0`.      |
| returns         | `Promise<TokenHolder[]>` | List of token holders.                                |

### Tokens\#onHolders\(filters, callback\)

Subscribe to a list of token holders. The callback is optional, not passing it will return a partially applied function.

| Name       | Type                                                  | Description                                                                               |
| ---------- | ----------------------------------------------------- | ----------------------------------------------------------------------------------------- |
| `filters`  | `Object`                                              | Optional object allowing to filter the token holders. See `Tokens#holders()` for details. |
| `callback` | `(error: Error, tokenHolders: TokenHolder[]) => void` | A callback that will get called every time the result gets updated.                       |
| returns    | `{ unsubscribe: () => void }`                         | Unsubscribe function.                                                                     |

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
