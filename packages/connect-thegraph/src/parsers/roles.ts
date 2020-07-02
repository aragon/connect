import { Role, RoleData, PermissionData } from '@aragon/connect-core'
import { QueryResult } from '../types'

async function _parseRole(
  role: any,
  connector: any,
  contentUri: string | null,
  artifact?: string | null
): Promise<Role> {
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
    contentUri,
  }

  const roleEntity = new Role(connector)
  await roleEntity.create(roleData)

  return roleEntity
}

export async function parseRole(
  result: QueryResult,
  connector: any
): Promise<Role> {
  const app = result.data.app
  const role = result.data.role

  if (!role) {
    throw new Error('Unable to parse role.')
  }

  return _parseRole(role, connector, app?.contentUri, app.version?.artifact)
}

export async function parseRoles(
  result: QueryResult,
  connector: any
): Promise<Role[]> {
  const app = result.data.app
  const roles = app?.roles

  if (!roles) {
    throw new Error('Unable to parse roles.')
  }

  return Promise.all(
    roles.map(async (role: any) => {
      return _parseRole(role, connector, app?.contentUri, app.version?.artifact)
    })
  )
}
