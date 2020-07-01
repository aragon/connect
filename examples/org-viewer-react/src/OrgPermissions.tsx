/** @jsx jsx */
import { useEffect, useState } from 'react'
import { jsx } from '@emotion/core'
import { usePermissions } from '@aragon/connect-react'
import Group from './Group'
import Table from './Table'

export default function OrgPermissions() {
  const [permissions, error, loading] = usePermissions()

  return (
    <Group name="Permissions" loading={loading}>
      <Table
        headers={['App', 'Role', 'Grantee']}
        rows={
          permissions
            ? permissions.map(permission => [
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
