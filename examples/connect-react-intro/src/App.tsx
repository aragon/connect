import React from 'react'
import { Connect } from '@1hive/connect-react'
import Info from './Info'

function App() {
  return (
    <Connect location="a1.aragonid.eth" connector="thegraph">
      <Info />
    </Connect>
  )
}

export default App
