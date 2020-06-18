# ⚡ Aragon Connect for React

## Usage

```jsx
import { useConnect, UseConnectProvider } from '@aragon/connect-react'
import Voting from '@aragon/connect-thegraph-voting'

function App() {
  const [org, orgError, orgLoading] = useConnect('org.aragonid.eth', 'thegraph')

  const [apps, appsError, appsLoading] = org.apps() // receives updates

  const [voting, votingError, votingLoading] = org.app({
    appName: 'voting.aragonpm.eth',
  })

  const [votingData] = voting.connect(Voting)

  const [votes, votesError, votesLoading] = voting.votes() // receives updates

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
