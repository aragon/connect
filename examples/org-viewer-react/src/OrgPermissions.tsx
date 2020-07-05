/** @jsx jsx */
import { jsx } from '@emotion/core'
import { usePermissions, Permission } from '@aragon/connect-react'
import { shortenAddress } from './utils'
import Group from './Group'
import Table from './Table'

export default function OrgPermissions() {
  const [permissions, { loading }] = usePermissions()
  return (
    <Group name="Permissions" loading={loading}>
      <Table
        headers={['App', 'Role', 'Grantee']}
        rows={
          permissions
            ? permissions.map((permission: Permission) => [
                permission.appAddress
                  ? shortenAddress(permission.appAddress)
                  : '?',
                shortenAddress(permission.roleHash),
                shortenAddress(permission.granteeAddress),
              ])
            : []
        }
      />
    </Group>
  )
}
