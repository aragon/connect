# Tokens app

This is an Aragon app specific connector for the Tokens app built using The Graph.

## Connector API

To create a new instance of the connector, you need the specific Tokens app address and a Subgraph URL:

```javascript
import { TokenManager } from '@aragon/connect-thegraph-tokens'

const tokenManager = new TokenManager(
  TOKENS_APP_ADDRESS,
  TOKENS_APP_SUBGRAPH_URL
)
```

Once you have a an instance of the `TokenManager` object, you can use the following API to fetch data.

### tokenManager\#token\(tokenManagerAddress\)

Get the data of the token used in the provided Tokens app. The token is always an [ERC-20 MiniMe token](https://github.com/aragon/minime).

| Name                  | Type             | Description                             |
| --------------------- | ---------------- | --------------------------------------- |
| `tokenManagerAddress` | `String`         | Address of the Tokens app.              |
| returns               | `Promise<Token>` | Result data parsed as a `Token` entity. |

### tokenManager\#tokenHolders\(tokenAddress, first, skip\)

Get the data of the token holders of the token used in the provided app.

| Name           | Type                     | Description                                    |
| -------------- | ------------------------ | ---------------------------------------------- |
| `tokenAddress` | `String`                 | Address of the Minime Token.                   |
| `first`        | `String`                 | Pagination argument.                           |
| `skip`         | `String`                 | Pagination argument.                           |
| returns        | `Promise<TokenHolder[]>` | Result data parsed as a list of token holders. |

### tokenManager\#onTokenHolders\(tokenAddress, callback\)

Subscribe to the data of the token holders of the token used in the provided app.

| Name           | Type       | Description                                  |
| -------------- | ---------- | -------------------------------------------- |
| `tokenAddress` | `String`   | Address of the Minime Token.                 |
| `callback`     | `Function` | Callback function call on every data update. |
| returns        | `Function` | Unsubscribe function.                        |

## Subgraph schema

The Subgraph schema defines all of the available entities and attributes. It may be useful to gain a fuller, clearer picture of the information you can request.

```yaml
type TokenManager @entity {
  id: ID!
  address: Bytes!
  orgAddress: Bytes!
  token: MiniMeToken! @derivedFrom(field: "tokenManager")
}

type MiniMeToken @entity {
  id: ID!
  address: Bytes!
  totalSupply: BigInt!
  transferable: Boolean!
  name: String!
  symbol: String!
  orgAddress: Bytes
  appAddress: Bytes
  tokenManager: TokenManager
  holders: [TokenHolder!]!
}

type TokenHolder @entity {
  id: ID!
  address: Bytes!
  tokenAddress: Bytes!
  balance: BigInt!
}
```
