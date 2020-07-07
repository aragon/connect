import React from 'react'
import { Connect } from '@aragon/connect-react'
import Info from './Info'
import SimpleVote from './SimpleVote'

function App() {
  return (
    <Connect location="a1.aragonid.eth" connector="thegraph">
      <Info />
      {/*<SimpleVote />*/}
    </Connect>
  )
}

export default App
