import ReactDOM from 'react-dom'
import React from 'react'
import { Connect, useOrganization } from '@aragon/connect-react'

function App() {
  const [org] = useOrganization()
  return <div>Org address: {org ? org.address : 'loading…'}</div>
}

ReactDOM.render(
  <Connect location="pierre.aragonid.eth" connector="thegraph">
    <App />
  </Connect>,
  document.querySelector('#app')
)
