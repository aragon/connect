# Aragon Connect

This file documents the main exports of the library.

## connect(location, config)

Connects and returns an `Organization` for `location`.

| Name                 | Type                                               | Description                                                                                                                        |
| -------------------- | -------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| `location`           | `String`                                           | The Ethereum address or ENS domain of an Aragon organization.                                                                      |
| `config`             | `Object`                                           | The optional configuration object.                                                                                                 |
| `config.connector`   | `Connector \| [String, Object] \| String`          | Accepts a `Connector` instance, and either a string or a tuple for embedded connectors and their config. Defaults to `"thegraph"`. |
| `config.ipfs`        | `(ipfsIdentifier: String, path: String) => String` | A function that resolves an IPFS identifier and a path into an HTTP URL. Defaults to gateway.ipfs.io.                              |
| `config.ensRegistry` | `String`                                           | The address of the ENS registry to use as resolver.                                                                                |
| returns              | `Promise<Organization>`                            | An `Organization` instance.                                                                                                        |

### Errors

| Type                   | Description                                            |
| ---------------------- | ------------------------------------------------------ |
| `ConnectionError`      | Gets thrown if the connection fails.                   |
| `OrganizationNotFound` | Gets thrown if the organization doesn’t seem to exist. |

### Example

```js
import { connect } from '@aragon/connect'

// Connections should get wrapped in a try / catch to capture connection errors.
try {
  // Connect to an org using the default config
  const org1 = await connect('org1.aragonid.eth')

  // Specify a connector
  const org2 = await connect('org2.aragonid.eth', { connector: 'thegraph' })

  // Specify a connector and its config
  const org3 = await connect('org3.aragonid.eth', {
    connector: ['thegraph', { daoSubgraphUrl: 'http://…' }],
  })

  // Custom connector
  const org4 = await connect('org4.aragonid.eth', {
    // CustomConnector implements IConnector
    connector: new CustomConnector(),
  })
} catch (err) {
  if (err instanceof ConnectionError) {
    console.error('Connection error')
  } else {
    console.error(err)
  }
}
```

## connect(config)

When `connect()` gets called with a config only, it returns a function that allows to connect to multiple organizations with the same configuration.

| Name               | Type                                                   | Description                                                                                                                        |
| ------------------ | ------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------- |
| `config`           | `Object`                                               | The optional configuration object.                                                                                                 |
| `config.connector` | `Connector \| [String, Object] \| String`              | Accepts a `Connector` instance, and either a string or a tuple for embedded connectors and their config. Defaults to `"thegraph"`. |
| returns            | `Promise<(location: String) => Promise<Organization>>` | Connects once, and returns a function that allows to get multiple `Organization` instances.                                        |

### Errors

| Type                   | Description                                    |
| ---------------------- | ---------------------------------------------- |
| `ConnectionError`      | Gets thrown if the connection fails.           |
| `OrganizationNotFound` | Gets thrown if the organization doesn’t exist. |

### Example

```js
import { connect } from '@aragon/connect'

const getOrg = await connect({ connector: 'thegraph' })

const org1 = getOrg('org1.aragonid.eth')
const org2 = getOrg('org2.aragonid.eth')
const org3 = getOrg('org3.aragonid.eth')
```
