# Using Aragon Connect with React

## Introduction

Aragon Connect provides a series of utilities that simplify the usage of Aragon Connect in a React environment.

It consists of the `<Connect />` component, through which a connection to an organization is described, and a series of hooks: `useApp()`, `useApps()`, `useOrganization()`, `usePermissions()`.

To get started, add the `@aragon/connect-react` package to your project. It contains all the exports of the `@aragon/connect`, so you don’t have to install both.

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

### &lt;Connect />

This component is required in order to use the provided hooks.

| Props              | Type                                                 | Description                                                                                              |
| ------------------ | ---------------------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| `location`         | `String`                                             | The Ethereum address or ENS domain of an Aragon organization.                                            |
| `connector`        | `Connector` or `[String, Object]` or `String`        | Accepts a `Connector` instance, and either a string or a tuple for embedded connectors and their config. |
| `options`          | `Object`                                             | The optional configuration object.                                                                       |
| `options.ethereum` | `EthereumProvider`                                   | An [EIP-1193](https://eips.ethereum.org/EIPS/eip-1193) compatible object.                                |
| `options.network`  | [`Networkish`](../api-reference/types.md#networkish) | The network to connect to. Defaults to `1`.                                                              |

### useOrganization()

| Props   | Type                                                                                  | Description                                                                                           |
| ------- | ------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| returns | `[Organization \| null, { loading: boolean, error: null \| Error, retry: Function }]` | An array containing the [organization](../api-reference/organization.md) and a loading status object. |

### useApp(appFilters)

| Name                | Type                                                                         | Description                                                                                                                                                                                                                                                   |
| ------------------- | ---------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `appFilter`         | `String` or `Object` \(optional\)                                            | When a string is passed, the app will get searched by address if it starts by `0x`, and by `appName` otherwise. See `appFilter.address` and `appFilter.appName` to set them explicitly. For the time being, only one type of filter can get passed at a time. |
| `appFilter.address` | `String`                                                                     | Same as `appFilter`, but makes the selection by `address` explicit.                                                                                                                                                                                           |
| `appFilter.appName` | `String`                                                                     | Same as `appFilter`, but makes the selection by `appName` explicit.                                                                                                                                                                                           |
| returns             | `[App \| null, { loading: boolean, error: null \| Error, retry: Function }]` | An array containing a single [app](../api-reference/app.md) from the organization and a loading status object.                                                                                                                                                |

### useApps(appFilters)

| Name                | Type                                                                   | Description                                                                                                                                                                                                                                                                                                                        |
| ------------------- | ---------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `appFilter`         | `String` or `String[]` or object (optional)                            | When a string is passed, apps will get filtered by address if it starts by `0x`, and by `appName` otherwise. When an array is passed, the first entry determines the type of filter. See `appFilter.address` and `appFilter.appName` to set them explicitly. For the time being, only one type of filter can get passed at a time. |
| `appFilter.address` | `String` or `String[]`                                                 | Same as `appFilter`, but makes the selection by `address` explicit.                                                                                                                                                                                                                                                                |
| `appFilter.appName` | `String` or `String[]`                                                 | Same as `appFilter`, but makes the selection by `appName` explicit.                                                                                                                                                                                                                                                                |
| returns             | `[App[], { loading: boolean, error: null \| Error, retry: Function }]` | An array containing the organization [apps](../api-reference/app.md) and a loading status object.                                                                                                                                                                                                                                  |

### usePermissions()

| Name    | Type                                                                          | Description                                                                                                     |
| ------- | ----------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------- |
| returns | `[Permission[], { loading: boolean, error: null \| Error, retry: Function }]` | An array containing the organization [permissions](../api-reference/permission.md) and a loading status object. |

### createAppHook()

This utility function makes app connectors available in your React app.

This is how it works at the most basic level:

```jsx
import { createAppHook, useApp } from '@aragon/connect-react'
import connectVoting from '@aragon/connect-voting'

// We create a hook corresponding to the app connector. This is usually enough,
// since the app connector will inherit from the connection set on <Connect />.
const useVoting = createAppHook(connectVoting)

function Votes() {
  const [voting] = useApp('voting')

  // And this is how we can use it, by passing the app instance and a callback.
  const [votes] = useVoting(voting, (app) => app.votes())

  return (
    <ul>
      {votes ? (
        votes.map((vote) => <li key={vote.id}>{formatVote(vote)}</li>)
      ) : (
        <li>Loading votes…</li>
      )}
    </ul>
  )
}
```

#### Dependency array

By default, the callback will be called once, and never update afterwards. This can be a problem if you want to reload data depending on the current state. This is why the hook also accept a dependency parameter. It behaves in a very similar way to the `useEffect()` or `useMemo()` hooks, except that it doesn’t update the callback when omitted.

This is how you can use it:

```jsx
import connect from '@aragon/connect'
import connectVoting from '@aragon/connect-voting'
import { createAppHook, useApp } from '@aragon/connect-react'

const useVoting = createAppHook(connectVoting)

function App() {
  const [page, setPage] = useState(0)
  const [voting] = useApp('voting')

  const [votes] = useVoting(
    voting,
    (app) => app.votes({ first: 10, skip: 10 * page }),
    [page]
  )

  return (
    <div>
      <ul>
        {votes ? (
          votes.map((vote) => <li key={vote.id}>{formatVote(vote)}</li>)
        ) : (
          <li>Loading votes…</li>
        )}
      </ul>
      <button onClick={() => setPage(page + 1)}>prev</button>
      <button onClick={() => setPage(page - 1)}>next</button>
    </div>
  )
}
```

#### Subscriptions

An issue with the previous examples is that we only fetch the data once, instead of receiving updates from it. For example, someone might create a new vote, and it is reasonable to expect an app to reflect that. With the app connectors API, you generally have `onX` equivalents of the async methods, like `votes(filters)` and `onVotes(filters, callback)`.

Using them with `createAppHook()` hooks requires to call the `onX` equivalent of the async method you want to use, but without passing a callback. App connectors return a partially applied function when the callback is omitted, which `createAppHook()` takes advantage of by entirely managing the subscription.

```jsx
import connect from '@aragon/connect'
import connectVoting from '@aragon/connect-voting'
import { createAppHook, useApp } from '@aragon/connect-react'

const useVoting = createAppHook(connectVoting)

function App() {
  const [page, setPage] = useState(0)
  const [voting] = useApp('voting')

  // votes will now get updated automatically
  const [votes] = useVoting(
    voting,

    // Note that we are now using onVotes() rather than votes()
    (app) => app.onVotes({ first: 10, skip: 10 * page }),

    // When page changes, a new subscription will replace the previous one
    [page]
  )

  return (
    <div>
      <ul>
        {votes ? (
          votes.map((vote) => <li key={vote.id}>{formatVote(vote)}</li>)
        ) : (
          <li>Loading votes…</li>
        )}
      </ul>
      <button onClick={() => setPage(page + 1)}>prev</button>
      <button onClick={() => setPage(page - 1)}>next</button>
    </div>
  )
}
```
