/** @jsx jsx */
import { css, jsx } from '@emotion/core'
import { Fragment } from 'react'
import { useOrganization } from '@aragon/connect-react'
import OrgApps from './OrgApps'
import OrgInfo from './OrgInfo'
import OrgPermissions from './OrgPermissions'

type OrgGroupsProps = { onOpenApp: (appAddress: string) => void }

export default function OrgGroups({ onOpenApp }: OrgGroupsProps) {
  const [org, { loading }] = useOrganization()
  return (
    <Fragment>
      {loading && (
        <p
          css={css`
            position: fixed;
            top: 10px;
            left: 50%;
            transform: translateX(-50%);
            margin: 0;
            padding: 10px 20px;
            background: #fff;
            border-radius: 6px;
            border: 2px solid #fad4fa;
          `}
        >
          Loading…
        </p>
      )}
      {org && (
        <Fragment>
          <OrgInfo />
          <OrgApps onOpenApp={onOpenApp} />
          <OrgPermissions />
        </Fragment>
      )}
    </Fragment>
  )
}
