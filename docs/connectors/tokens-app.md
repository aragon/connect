# Tokens app

This is an app connector for the Tokens app (`token-manager.aragonpm.eth`). It only supports The Graph for now.

## API

To create a new instance of the connector, you need the specific Tokens app address and a Subgraph URL:

```js
import connect from '@aragon/connect'
import connectTokens from '@aragon/connect-tokens'

const org = connect('myorg.aragonid.eth', 'thegraph')
const tokens = connectTokens(org.app('token-manager'))
```

It extends the `App` object, which means that every method and properties of [`App`](../api-reference/app.md) are also available on this object.

Once you have a `Tokens` instance, you can use the following API to retrieve its data:

### Tokens\#token\(\)

Get the `Token` instance used with the app.

| Name    | Type             | Description       |
| ------- | ---------------- | ----------------- |
| returns | `Promise<Token>` | A `Token` object. |

The `Token` object contains the following properties:

| Name           | Type      | Description                                                               |
| -------------- | --------- | ------------------------------------------------------------------------- |
| `id`           | `String`  | A unique ID representing this token.                                      |
| `address`      | `String`  | Address of the [MiniMe Token contract](https://github.com/Giveth/minime). |
| `name`         | `String`  | The token name (e.g. “Aragon Network Token”).                             |
| `symbol`       | `String`  | The token symbol (e.g. “ANT”).                                            |
| `totalSupply`  | `String`  | The total supply of the token.                                            |
| `transferable` | `Boolean` | Whether the token is transferable.                                        |

### Tokens\#holders\(filters\)

Get a list of token holders.

| Name            | Type                     | Description                                           |
| --------------- | ------------------------ | ----------------------------------------------------- |
| `filters`       | `Object`                 | Optional object allowing to filter the token holders. |
| `filters.first` | `Number`                 | Maximum number of token holders. Defaults to `1000`.  |
| `filters.skip`  | `Number`                 | Skip a number of token holders. Defaults to `0`.      |
| returns         | `Promise<TokenHolder[]>` | List of token holders.                                |

### Tokens\#onHolders\(filters, callback\)

Subscribe to a list of token holders.

| Name            | Type                   | Description                                                         |
| --------------- | ---------------------- | ------------------------------------------------------------------- |
| `filters`       | `Object`               | Optional object allowing to filter the token holders.               |
| `filters.first` | `Number`               | Maximum number of token holders. Defaults to `1000`.                |
| `filters.skip`  | `Number`               | Skip a number of token holders. Defaults to `0`.                    |
| `callback`      | `tokenHolders => void` | A callback that will get called every time the result gets updated. |
| returns         | `Function`             | Unsubscribe function.                                               |
