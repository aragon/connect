import { Role, RoleData, PermissionData } from '@aragon/connect-core'
import { QueryResult } from '../types'

function _parseRole(
  role: any,
  connector: any,
  artifact?: string | null
): Role {
  const grantees =
    role?.grantees &&
    role?.grantees.map(
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
  const role = result.data.role

  if (!role) {
    throw new Error('Unable to parse role.')
  }

  return _parseRole(role, connector)
}

export function parseRoles(
  result: QueryResult,
  connector: any
): Role[] {
  const app = result.data.app
  const roles = app?.roles

  if (!roles) {
    throw new Error('Unable to parse roles.')
  }

  return roles.map((role: any) => {
    return _parseRole(
      role,
      connector,
      app.version?.artifact
    )
  })
}
