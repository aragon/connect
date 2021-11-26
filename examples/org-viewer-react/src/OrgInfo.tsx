/** @jsx jsx */
import { jsx } from '@emotion/core'
import { useOrganization } from '@1hive/connect-react'
import { shortenAddress } from './utils'
import Group from './Group'
import Table from './Table'

export default function OrgApps() {
  const [org, { loading }] = useOrganization()
  return (
    <Group name="Organization" loading={loading}>
      <Table
        headers={['Name', 'Value']}
        rows={[
          ['location', org?.location || '…'],
          [
            'address',
            org?.address ? (
              <span title={org.address}>{shortenAddress(org.address)}</span>
            ) : (
              '…'
            ),
          ],
        ]}
      />
    </Group>
  )
}
