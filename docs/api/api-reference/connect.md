# connect\(\)

This file documents the main exports of the library.

## connect\(location, connector, config\)

Connects and returns an `Organization` for `location`.

| Name | Type | Description |
| :--- | :--- | :--- |
| `location` | `String` | The Ethereum address or ENS domain of an Aragon organization. |
| `connector` | `Connector \| [String, Object] \| String` | Accepts a `Connector` instance, and either a string or a tuple for embedded connectors and their config. |
| `config` | `Object` | The optional configuration object. |
| `config.readProvider` | `EthereumProvider` | An [EIP-1193](https://eips.ethereum.org/EIPS/eip-1193) compatible object. |
| `config.chainId` | `Number` | The [Chain ID](https://chainid.network/) to connect to. Defaults to `1`. |
| returns | `Promise<Organization>` | An `Organization` instance. |

### Errors

| Type | Description |
| :--- | :--- |
| `ConnectionError` | Gets thrown if the connection fails. |
| `OrganizationNotFound` | Gets thrown if the organization doesn’t seem to exist. |

### Example

```javascript
import { connect } from '@aragon/connect'

// Connections should get wrapped in a try / catch to capture connection errors.
try {
  // Connect to an org through The Graph
  const org1 = await connect('org1.aragonid.eth', 'thegraph')

  // Specify a different Chain ID
  const org3 = await connect('org3.aragonid.eth', 'thegraph', { chainId: 4 })

  // Specify a configuration for the connector
  const org3 = await connect('org3.aragonid.eth', [
    'thegraph',
    { orgSubgraphUrl: 'http://…' },
  ])

  // Custom connector
  const org4 = await connect(
    'org4.aragonid.eth',

    // CustomConnector implements IConnector
    new CustomConnector()
  )
} catch (err) {
  if (err instanceof ConnectionError) {
    console.error('Connection error')
  } else {
    console.error(err)
  }
}
```

