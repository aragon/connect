import { Role, RoleData, PermissionData } from '@aragon/connect-core'
import { App as AppDataGql } from '../queries/types'
import { Param as ParamDataGql } from '../queries/types'
import { Permission as PermissionDataGql } from '../queries/types'
import { Role as RoleDataGql } from '../queries/types'
import { QueryResult } from '../types'

function _parseRole(
  role: RoleDataGql,
  connector: any,
  artifact?: string | null
): Role {
  const grantees =
    role?.grantees &&
    role?.grantees.map(
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

  const roleData: RoleData = {
    appAddress: role.appAddress,
    manager: role.manager,
    hash: role.roleHash,
    grantees,
    artifact,
  }

  return new Role(roleData, connector)
}

export function parseRole(
  result: QueryResult,
  connector: any
): Role {
  const role = result.data.role as RoleDataGql

  if (!role) {
    throw new Error('Unable to parse role.')
  }

  return _parseRole(role, connector)
}

export function parseRoles(
  result: QueryResult,
  connector: any
): Role[] {
  const app = result.data.app as AppDataGql
  const roles = app?.roles

  if (!roles) {
    throw new Error('Unable to parse roles.')
  }

  return roles.map((role: RoleDataGql) => {
    return _parseRole(
      role,
      connector,
      app.version?.artifact
    )
  })
}
