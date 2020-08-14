import React from 'react'
import { Connect } from '@aragon/connect-react'
import { env } from './environment'
import useRouting from './use-routing'
import Main from './Main'
import OrgApps from './OrgApps'
import OrgInfo from './OrgInfo'
import OrgInput from './OrgInput'
import OrgPermissions from './OrgPermissions'

export default function App() {
  const { openOrg, openApp, orgName } = useRouting()
  return (
    <Connect
      location={filterOrgName(orgName)}
      connector="thegraph"
      options={{ network: env.chainId }}
    >
      <Main>
        <OrgInput onChange={openOrg} orgName={orgName} />
        <OrgInfo />
        <OrgApps onOpenApp={openApp} />
        <OrgPermissions />
      </Main>
    </Connect>
  )
}

function filterOrgName(name: string): string {
  name = name.trim()
  if (!name.includes('.')) {
    return name + '.aragonid.eth'
  }
  return name
}
