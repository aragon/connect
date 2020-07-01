/** @jsx jsx */
import { jsx } from '@emotion/core'
import { useOrganization, Organization } from '@aragon/connect-react'
import Group from './Group'
import Table from './Table'

export default function OrgApps() {
  const [org, orgError, orgLoading] = useOrganization()

  if (!org) {
    return null
  }

  return (
    <Group name="Organization">
      <Table
        headers={['Name', 'Value']}
        rows={[
          ['location', org.location],
          [
            'address',
            <span title={org.address}>{org.address.slice(0, 10) + '…'}</span>,
          ],
        ]}
      />
    </Group>
  )
}
