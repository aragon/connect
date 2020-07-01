import React from 'react'
import { Connect } from '@aragon/connect-react'
import { env } from './environment'
import useRouting from './use-routing'
import Main from './Main'
import OrgInput from './OrgInput'
import OrgGroups from './OrgGroups'

export default function App() {
  const { openOrg, openApp, orgName } = useRouting()
  return (
    <Connect
      location={filterOrgName(orgName)}
      connector={['thegraph', { orgSubgraphUrl: env.orgSubgraphUrl }]}
      options={{ chainId: env.chainId }}
    >
      <Main>
        <OrgInput onChange={openOrg} orgName={orgName} />
        <OrgGroups onOpenApp={openApp} />
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
