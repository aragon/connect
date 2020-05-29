import { PermissionData } from '@aragon/connect'
import { Organization as OrganizationDataGql } from '../queries/types'
import { Permission as PermissionDataGql } from '../queries/types'
import { Param as ParamDataGql } from '../queries/types'
import { QueryResult } from '../types'

export function parsePermissions(result: QueryResult): PermissionData[] {
  const org = result.data.organization as OrganizationDataGql
  const permissions = org?.permissions as PermissionDataGql[]

  if (!permissions) {
    throw new Error('Unable to parse permissions.')
  }

  return permissions.map(
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
}
