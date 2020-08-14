/** @jsx jsx */
import { Fragment, useEffect, useState } from 'react'
import { css, jsx } from '@emotion/core'
import { connect } from '@aragon/connect'
import Main from './Main'
import OrgApps from './OrgApps'
import OrgInfo from './OrgInfo'
import OrgPermissions from './OrgPermissions'
import TextButton from './TextButton'
import { useCancellableAsync } from './generic-hooks'
import { env } from './environment'

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

function filterOrgName(name: string): string {
  name = name.trim()
  if (!name.includes('.')) {
    return name + '.aragonid.eth'
  }
  return name
}

export default function App() {
  const { openOrg, openApp, orgName } = useRouting()

  const [org = null, loading] = useCancellableAsync(
    async () =>
      connect(filterOrgName(orgName), 'thegraph', { network: env.chainId }),
    [orgName]
  )

  return (
    <Main>
      {loading && (
        <p
          css={css`
            position: fixed;
            top: 0;
            left: 50%;
            transform: translateX(-50%);
            margin: 0;
            padding: 10px;
            background: #fff;
            border-radius: 6px;
          `}
        >
          Loading org…
        </p>
      )}
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
          onChange={(event) => openOrg(event.target.value)}
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
        {env.addresses.map((name, index) => (
          <span key={name}>
            {index > 0 && <span>, </span>}
            <TextButton onClick={() => openOrg(name)}>
              {name.match(/^[^\.]+/)?.[0]}
            </TextButton>
          </span>
        ))}
        .
      </div>

      {org && (
        <Fragment>
          <OrgInfo org={org} />
          <OrgApps org={org} onOpenApp={openApp} />
          <OrgPermissions org={org} />
        </Fragment>
      )}
    </Main>
  )
}
