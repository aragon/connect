import {
  ConnectionContext,
  Permission,
  PermissionData,
} from '@aragon/connect-core'
import { QueryResult } from '../types'

export function parsePermissions(
  result: QueryResult,
  connection?: ConnectionContext
): Permission[] {
  if (!connection) {
    throw new Error(
      'Unable to parse permission because there is no connection. ' +
        'Has the .connect() method been called on the organization connector?'
    )
  }

  const org = result?.data?.organization
  const permissions = org?.permissions

  if (!Array.isArray(permissions)) {
    throw new Error('Unable to parse permissions.')
  }

  const datas = permissions.map(
    (permission: any): PermissionData => ({
      appAddress: permission?.appAddress,
      allowed: permission?.allowed,
      granteeAddress: permission?.granteeAddress,
      params:
        permission?.params?.map?.((param: any) => ({
          argumentId: param?.argumentId,
          operationType: param?.operationType,
          argumentValue: param?.argumentValue,
        })) || [],
      roleHash: permission?.roleHash,
    })
  )

  const allowedPermissions = datas.filter(
    (data: PermissionData) => data.allowed
  )

  return allowedPermissions.map((data: PermissionData) => {
    return new Permission(data, connection)
  })
}
