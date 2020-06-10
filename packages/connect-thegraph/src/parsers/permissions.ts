import { Permission, PermissionData } from '@aragon/connect-core'
import { Organization as OrganizationDataGql } from '../queries/types'
import { Permission as PermissionDataGql } from '../queries/types'
import { Param as ParamDataGql } from '../queries/types'
import { QueryResult } from '../types'

export function parsePermissions(
  result: QueryResult,
  connector: any
): Permission[] {
  const org = result.data.organization as OrganizationDataGql
  const permissions = org?.permissions as PermissionDataGql[]

  if (!permissions) {
    throw new Error('Unable to parse permissions.')
  }

  const datas = permissions.map(
    (permission: PermissionDataGql): PermissionData => {
      return {
        appAddress: permission.appAddress,
        allowed: permission.allowed,
        granteeAddress: permission.granteeAddress,
        params:
          permission.params.map((param: ParamDataGql) => {
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
