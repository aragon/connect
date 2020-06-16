/** @jsx jsx */
import { jsx } from '@emotion/core'
import { Organization } from '@aragon/connect'
import Group from './Group'
import Table from './Table'

type OrgInfoProps = {
  org?: Organization
}

export default function OrgApps({ org }: OrgInfoProps) {
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
