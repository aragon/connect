/** @jsx jsx */
import { jsx } from '@emotion/core'
import { Organization } from '@aragon/connect'
import Group from './Group'
import Table from './Table'

type OrgInfoProps = {
  org?: Organization
  orgAddress: string
}

export default function OrgApps({ orgAddress }: OrgInfoProps) {
  if (!orgAddress) {
    return null
  }

  return (
    <Group name="Organization">
      <Table
        headers={['Name', 'Value']}
        rows={[[ 'address', orgAddress.slice(0, 10) + '…' ]]}
      />
    </Group>
  )
}
