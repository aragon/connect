/** @jsx jsx */
import { jsx } from '@emotion/core'
import { Organization } from '@aragon/connect'
import Group from './Group'
import Table from './Table'

type OrgInfoProps = {
  org?: Organization
  orgAddress: string
}

export default function OrgApps({ org, orgAddress }: OrgInfoProps) {
  if (!org) {
    return null
  }

  return (
    <Group name="Organization">
      <Table
        headers={['Name', 'Value']}
        rows={Object.entries({ ...org, address: orgAddress }).map(
          ([name, value]) => {
            if (value.startsWith('0x')) {
              value = value.slice(0, 10) + '…'
            }
            return [name, value]
          }
        )}
      />
    </Group>
  )
}
