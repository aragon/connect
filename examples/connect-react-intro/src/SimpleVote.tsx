import React from 'react'
// import { useWallet } from 'use-wallet'
import { useApp, useOrganization, useApps } from '@aragon/connect-react'

export default function SimpleVote() {
  const [org, orgStatus] = useOrganization()
  const [apps, appsStatus] = useApps()

  console.log('??', apps, orgStatus, appsStatus)

  // if (!app) {
  //   return <div>Loading…</div>
  // }

  return (
    <>
      <h1>Simple Vote</h1>
    </>
  )
}
