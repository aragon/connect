/** @jsx jsx */
import { useEffect, useState } from 'react'
import { jsx } from '@emotion/core'
import { Organization, Permission } from '@aragon/connect'
import Group from './Group'
import Table from './Table'
import { useCancellableAsync } from './generic-hooks'

type Props = {
  org?: Organization
}

export default function OrgPermissions({ org }: Props) {
  const [permissions = [], loading] = useCancellableAsync<Permission[]>(
    async () => (org ? org.permissions() : []),
    [org]
  )

  return (
    <Group name="Permissions" loading={loading}>
      <Table
        headers={['App', 'Role', 'Grantee']}
        rows={
          permissions
            ? permissions.map((permission: Permission) => [
                (permission.appAddress || '?').slice(0, 6),
                permission.roleHash.slice(0, 6),
                permission.granteeAddress.slice(0, 6),
              ])
            : []
        }
      />
    </Group>
  )
}
