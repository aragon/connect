import ReactDOM from 'react-dom'
import React from 'react'
import { Connect, useOrganization } from '@1hive/connect-react'

function App() {
  const [org, { error, loading }] = useOrganization()
  if (loading) {
    return <div>Loading…</div>
  }
  if (error) {
    return <div>Error: {error.message}</div>
  }
  return <div>Org address: {org?.address}</div>
}

ReactDOM.render(
  <Connect location="pierre.aragonid.eth" connector="thegraph">
    <App />
  </Connect>,
  document.querySelector('#app')
)
