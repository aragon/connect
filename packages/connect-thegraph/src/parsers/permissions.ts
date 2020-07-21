import {
  IOrganizationConnector,
  Permission,
  PermissionData,
} from '@aragon/connect-core'
import { QueryResult } from '../types'

export function parsePermissions(
  result: QueryResult,
  connector: IOrganizationConnector
): Permission[] {
  const org = result.data.organization
  const permissions = org?.permissions

  if (!permissions) {
    throw new Error('Unable to parse permissions.')
  }

  const datas = permissions.map(
    (permission: any): PermissionData => {
      return {
        appAddress: permission.appAddress,
        allowed: permission.allowed,
        granteeAddress: permission.granteeAddress,
        params:
          permission.params.map((param: any) => {
            return {
              argumentId: param.argumentId,
              operationType: param.operationType,
              argumentValue: param.argumentValue,
            }
          }) || [],
        roleHash: permission.roleHash,
      }
    }
  )

  const allowedPermissions = datas.filter((data: PermissionData) => data.allowed)

  return allowedPermissions.map((data: PermissionData) => {
    return new Permission(data, connector)
  })
}
