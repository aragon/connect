/** @jsx jsx */
import { useEffect, useState } from 'react'
import { css, jsx } from '@emotion/core'
import { connect } from '@aragon/connect'
import Main from './Main'
import OrgApps from './OrgApps'
import OrgInfo from './OrgInfo'
import OrgPermissions from './OrgPermissions'
import TextButton from './TextButton'
import { useCancellableAsync } from './generic-hooks'
import { env } from './environment'

function addressFromOrgName(orgName: string) {
  return (
    env.addresses.get(orgName) ||
    env.addresses.get(`${orgName}.aragonid.eth`) ||
    orgName
  )
}

function useRouting() {
  const [orgName, setOrgName] = useState('')

  const openOrg = (orgName: string) => {
    window.location.hash = `/${orgName}`
  }

  const openApp = (appAddress: string) => {
    window.location.hash = `/${orgName}/${appAddress}`
  }

  useEffect(() => {
    const onChange = () => {
      const org = window.location.hash.match(/^#\/([^\/]+)/)?.[1]
      setOrgName(org || '')
    }

    onChange()
    window.addEventListener('hashchange', onChange)

    return () => {
      window.removeEventListener('hashchange', onChange)
    }
  }, [])

  return { orgName, openOrg, openApp }
}

export default function App() {
  const { openOrg, openApp, orgName } = useRouting()

  useEffect(() => {
    openOrg([...env.addresses.keys()][0])
  }, [])

  const [org] = useCancellableAsync(
    async () =>
      connect(addressFromOrgName(orgName.trim()), [
        'thegraph',
        { daoSubgraphUrl: env.daoSubgraphUrl },
      ]),
    [orgName]
  )

  return (
    <Main>
      <label>
        <div
          css={css`
            padding-left: 4px;
            padding-bottom: 8px;
            font-size: 20px;
          `}
        >
          Enter an org location:
        </div>
        <input
          onChange={event => openOrg(event.target.value)}
          placeholder="e.g. xyz.aragonid.eth"
          type="text"
          value={orgName}
          css={css`
            width: 100%;
            padding: 12px;
            border: 2px solid #fad4fa;
            border-radius: 6px;
            font-size: 24px;
            outline: 0;
          `}
        />
      </label>
      <div
        css={css`
          white-space: nowrap;
          padding-top: 8px;
          padding-left: 4px;
          font-size: 20px;
        `}
      >
        Or pick one:&nbsp;
        {[...env.addresses.keys()].map((name, index) => (
          <span key={name}>
            {index > 0 && <span>, </span>}
            <TextButton onClick={() => openOrg(name)}>
              {name.match(/^[^\.]+/)?.[0]}
            </TextButton>
          </span>
        ))}
        .
      </div>
      <OrgInfo org={org} orgAddress={addressFromOrgName(orgName)} />
      <OrgApps org={org} onOpenApp={openApp} />
      <OrgPermissions org={org} />
    </Main>
  )
}
