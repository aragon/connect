import { Organization, Permission, PermissionData } from '@aragon/connect-core'
import { QueryResult } from '../types'

export function parsePermissions(
  result: QueryResult,
  organization: Organization
): Permission[] {
  const permissions = result?.data?.organization?.permissions

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
    return new Permission(data, organization)
  })
}
