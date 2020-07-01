# Aragon Connect for React

## Introduction

Aragon Connect for React provides a series of utilities that make Aragon Connect integrated into a React environment.

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
  // connect-react functions return three things: the data, the error, and the loading state.
  const [org, orgError, orgLoading] = useOrganization()

  const [apps, appsError, appsLoading] = useApps()
  const [permissions, permissionsError, permissionsLoading] = usePermissions()

  const loading = orgLoading || appsLoading || permissionsLoading
  const error = orgError || appsError || permissionsError

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
