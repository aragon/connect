# Usage with React

## Introduction

Aragon Connect provides a series of utilities that simplify the usage of Aragon Connect in a React environment.

It consists of the `<Connect />` component, through which a connection to an organization is described, and a series of hooks: `useApp()`, `useApps()`, `useOrganization()`, `usePermissions()`.

## Usage

```jsx
import {
  Connect,
  useApps,
  useOrganization,
  usePermissions,
} from '@aragon/connect-react'

function App() {
  const [org, orgStatus] = useOrganization()

  const [apps, appsStatus] = useApps()
  const [permissions, permissionsStatus] = usePermissions()

  const loading =
    orgStatus.loading || appsStatus.loading || permissionsStatus.loading
  const error = orgStatus.error || appsStatus.error || permissionsStatus.error

  if (loading) {
    return <p>Loading…</p>
  }

  if (error) {
    return <p>Error: {error.message}</p>
  }

  return (
    <>
      <h1>{org.name}</h1>

      <h2>Apps</h2>
      <ul>
        {apps.map((app, i) => (
          <li key={i}>{app.name}</li>
        ))}
      </ul>

      <h2>Permissions</h2>
      <ul>
        {permissions.map((permission, i) => (
          <li key={i}>{String(permission)}</li>
        ))}
      </ul>
    </>
  )
}

ReactDOM.render(
  <Connect location="myorg.aragonid.eth" connector="thegraph">
    <App />
  </Connect>,
  document.querySelector('main')
)
```

## API

### &lt;Connect /&gt;

This component is required in order to use the provided hooks.

| Props | Type | Description |
| :--- | :--- | :--- |
| `location` | `String` | The Ethereum address or ENS domain of an Aragon organization. |
| `connector` | `Connector \| [String, Object] \| String` | Accepts a `Connector` instance, and either a string or a tuple for embedded connectors and their config. |
| `options` | `Object` | The optional configuration object. |
| `options.readProvider` | `EthereumProvider` | An [EIP-1193](https://eips.ethereum.org/EIPS/eip-1193) compatible object. |
| `options.chainId` | `Number` | The [Chain ID](https://chainid.network/) to connect to. Defaults to `1`. |

### useOrganization\(\)

| Props | Type | Description |
| :--- | :--- | :--- |
| returns | `[Organization \| null, { loading: boolean, error: null \| Error, retry: Function }]` | An array containing the [organization](../api-reference/organization.md) and a loading status object. |

### useApp\(appFilters\)

| Name | Type | Description |
| :--- | :--- | :--- |
| `appFilter` | `String` or object \(optional\) | When a string is passed, the app will get searched by address if it starts by `0x`, and by `appName` otherwise. See `appFilter.address` and `appFilter.appName` to set them explicitly. For the time being, only one type of filter can get passed at a time. |
| `appFilter.address` | `String` | Same as `appFilter`, but makes the selection by `address` explicit. |
| `appFilter.appName` | `String` | Same as `appFilter`, but makes the selection by `appName` explicit. |
| returns | `[App \| null, { loading: boolean, error: null \| Error, retry: Function }]` | An array containing a single [app](../api-reference/app.md) from the organization and a loading status object. |

### useApps\(appFilters\)

| Name | Type | Description |
| :--- | :--- | :--- |
| `appFilter` | `String` or `String[]` or object \(optional\) | When a string is passed, apps will get filtered by address if it starts by `0x`, and by `appName` otherwise. When an array is passed, the first entry determines the type of filter. See `appFilter.address` and `appFilter.appName` to set them explicitly. For the time being, only one type of filter can get passed at a time. |
| `appFilter.address` | `String` or `String[]` | Same as `appFilter`, but makes the selection by `address` explicit. |
| `appFilter.appName` | `String` or `String[]` | Same as `appFilter`, but makes the selection by `appName` explicit. |
| returns | `[App[], { loading: boolean, error: null \| Error, retry: Function }]` | An array containing the organization [apps](../api-reference/app.md) and a loading status object. |

### usePermissions\(\)

| Name | Type | Description |
| :--- | :--- | :--- |
| returns | `[Permission[], { loading: boolean, error: null \| Error, retry: Function }]` | An array containing the organization [permissions](../api-reference/permission.md) and a loading status object. |

