/** @jsx jsx */
import { jsx } from '@emotion/core'
import { useOrganization } from '@aragon/connect-react'
import { shortenAddress } from './utils'
import Group from './Group'
import Table from './Table'

export default function OrgApps() {
  const [org] = useOrganization()

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
            <span title={org.address}>{shortenAddress(org.address)}</span>,
          ],
        ]}
      />
    </Group>
  )
}
