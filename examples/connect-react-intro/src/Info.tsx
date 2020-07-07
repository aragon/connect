import React from 'react'
import { useOrganization, useApps } from '@aragon/connect-react'
import LogButton from './LogButton'

export default function Info() {
  const [org] = useOrganization()
  const [apps] = useApps()

  if (!org) {
    return <div>Loading…</div>
  }

  return (
    <>
      <h1>Organization</h1>
      <div>location: {org.location}</div>
      <div>address: {org.address}</div>

      <h1>Apps</h1>
      {apps.map((app: any) => (
        <section key={app.address}>
          <h1>
            {app.name} <LogButton value={app} />
          </h1>
          <div>address: {app.address}</div>
          {app.version && <div>version: {app.version}</div>}
        </section>
      ))}
    </>
  )
}
