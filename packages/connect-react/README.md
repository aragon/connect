# ⚡ Aragon Connect for React

## Usage

```jsx
import { useConnect, UseConnectProvider } from '@aragon/connect-react'
import Voting from '@aragon/connect-thegraph-voting'

function App() {
  // useConnect() functions return three things: the data, the error, and the loading state.
  const [org, orgError, orgLoading] = useConnect('org.aragonid.eth', 'thegraph')

  // It looks like the @aragon/connect org.apps(), but it receives updates here.
  const [apps, appsError, appsLoading] = org.apps()

  // This app selection gets updated too.
  const [voting, votingError, votingLoading] = org.app({
    appName: 'voting.aragonpm.eth',
  })

  // We don’t really need error and loading as there is no connection step here,
  // but it might be needed in the future or with other types of connectors.
  // Calling .connect() to instantiate an app connector passes the context to it,
  // but also converts method calls into their subscription equivalents internally.
  // Voting is the same object than the one we use with @aragon/connect.
  const [votingData] = voting.connect(Voting)

  // Receives updates too.
  const [votes, votesError, votesLoading] = voting.votes()

  const loading = orgLoading || appsLoading || votingLoading || votesLoading
  const error = orgError || appsError || votingError || votesError

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
        {apps.map(app => (
          <li key={app.address}>{app.name}</li>
        ))}
      </ul>

      <h2>Votes</h2>
      <ul>
        {votes.map(vote => (
          <li key={vote.id}>{vote.metadata}</li>
        ))}
      </ul>
    </>
  )
}

ReactDOM.render(
  <UseConnectProvider>
    <App />
  </UseConnectProvider>,
  document.querySelector('main')
)
```
