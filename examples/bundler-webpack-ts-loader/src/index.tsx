// import ReactDOM from 'react-dom'
// import React from 'react'
// import { Connect, useOrganization } from '@aragon/connect-react'

import * as ethers from 'ethers'
console.log(
  'ethers.getDefaultProvider():',
  ethers.getDefaultProvider({ chainId: 1, name: 'homestead' })
)

// function App() {
//   const [org] = useOrganization()
//   return <div>Org address: {org ? org.address : 'loading…'}</div>
// }

// ReactDOM.render(
//   <Connect location="pierre.aragonid.eth" connector="thegraph">
//     <App />
//   </Connect>,
//   document.querySelector('#app')
// )
