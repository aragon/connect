# Using Aragon Connect with React

## Introduction

Aragon Connect provides a series of utilities that makes it easier to use in React environments.

It consists of the `<Connect />` component, on which a connection to an organization is described, and a series of hooks: `useApps()`, `useOrganization()`, `usePermissions()`.

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
