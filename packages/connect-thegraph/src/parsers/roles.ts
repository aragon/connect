import {
  ErrorNotFound,
  ErrorUnexpectedResult,
  Organization,
  PermissionData,
  Role,
  RoleData,
} from '@1hive/connect-core'
import { QueryResult } from '../types'

async function _parseRole(
  role: any,
  app: any,
  organization: Organization
): Promise<Role> {
  const grantees = role?.grantees?.map(
    (permission: any): PermissionData => ({
      appAddress: permission?.appAddress,
      allowed: permission?.allowed,
      granteeAddress: permission?.granteeAddress,
      params:
        permission?.params?.map((param: any) => ({
          argumentId: param?.argumentId,
          operationType: param?.operationType,
          argumentValue: param?.argumentValue,
        })) || [],
      roleHash: permission?.roleHash,
    })
  )

  const roleData: RoleData = {
    appAddress: role?.appAddress,
    appId: app?.appId,
    artifact: app?.version?.artifact,
    contentUri: app?.version?.contentUri,
    grantees: grantees || [],
    hash: role?.roleHash,
    manager: role?.manager,
  }

  return Role.create(roleData, organization)
}

export async function parseRole(
  result: QueryResult,
  organization: Organization
): Promise<Role> {
  const app = result?.data?.app
  const role = result?.data?.role

  if (role === null) {
    throw new ErrorNotFound('No role found.')
  }

  if (!app || !role) {
    throw new ErrorUnexpectedResult('Unable to parse role.')
  }

  return _parseRole(role, app, organization)
}

export async function parseRoles(
  result: QueryResult,
  organization: Organization
): Promise<Role[]> {
  const app = result?.data?.app
  const roles = app?.roles

  if (!app || !Array.isArray(roles)) {
    throw new ErrorUnexpectedResult('Unable to parse roles.')
  }

  return Promise.all(
    roles.map(async (role: any) => {
      return _parseRole(role, app, organization)
    })
  )
}
