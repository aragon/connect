import { Address, BigInt, Bytes } from '@graphprotocol/graph-ts'

// Import entity types from the schema
import {
  Organization as OrganizationEntity,
  Permission as PermissionEntity,
  Role as RoleEntity,
  Param as ParamEntity,
} from '../../generated/schema'

// Import event types from the templates contract ABI
import {
  ACL as AclContract,
  SetPermission as SetPermissionEvent,
  SetPermissionParams as SetPermissionParamsEvent,
  ChangePermissionManager as ChangePermissionManagerEvent,
} from '../../generated/templates/Acl/ACL'

import { ZERO_ADDR } from '../helpers/constants'

/* eslint-disable @typescript-eslint/no-use-before-define */

export function handleSetPermission(event: SetPermissionEvent): void {
  const acl = AclContract.bind(event.address)
  const orgAddress = acl.kernel()
  const orgId = orgAddress.toHex()
  const org = OrganizationEntity.load(orgId)

  const appAddress = event.params.app
  const roleHash = event.params.role
  const granteeAddress = event.params.entity

  const role = loadOrCreateRole(appAddress, roleHash)

  const permission = loadOrCreatePermission(
    appAddress,
    roleHash,
    granteeAddress
  )

  // update permission
  permission.allowed = event.params.allowed

  // update org permissions
  const orgPermissions = org.permissions
  orgPermissions.push(permission.id)
  org.permissions = orgPermissions

  org.save()
  permission.save()
  role.save()
}

export function handleChangePermissionManager(
  event: ChangePermissionManagerEvent
): void {
  const appAddress = event.params.app
  const roleHash = event.params.role

  const role = loadOrCreateRole(appAddress, roleHash)
  role.manager = event.params.manager

  role.save()
}

export function handleSetPermissionParams(
  event: SetPermissionParamsEvent
): void {
  const acl = AclContract.bind(event.address)

  const appAddress = event.params.app
  const roleHash = event.params.role
  const granteeAddress = event.params.entity

  // We know the permission exists because the smart contract always
  // emit handleSetPermission first
  const permission = loadOrCreatePermission(
    appAddress,
    roleHash,
    granteeAddress
  )

  // get params length
  const paramsLength = acl
    .getPermissionParamsLength(granteeAddress, appAddress, roleHash)
    .toI32()

  // iterate getting the params
  for (let index = 0; index < paramsLength; index++) {
    const param = loadOrCreateParam(
      appAddress,
      roleHash,
      granteeAddress,
      event.params.paramsHash,
      BigInt.fromI32(index),
      acl
    )

    // update permission params
    const permissionParams = permission.params
    permissionParams.push(param.id)
    permission.params = permissionParams

    // save param to the store
    param.save()
  }

  permission.save()
}

function buildRoleId(appAddress: Address, roleHash: Bytes): string {
  return appAddress.toHexString().concat('-').concat(roleHash.toHexString())
}

function loadOrCreateRole(appAddress: Address, roleHash: Bytes): RoleEntity {
  const roleId = buildRoleId(appAddress, roleHash)
  let role = RoleEntity.load(roleId)
  if (role === null) {
    role = new RoleEntity(roleId)
    role.roleHash = roleHash
    role.app = appAddress.toHexString()
    role.appAddress = appAddress
    role.manager = Bytes.fromHexString(ZERO_ADDR) as Bytes
  }
  return role!
}

function buildPermissionId(
  appAddress: Address,
  roleHash: Bytes,
  granteeAddress: Address
): string {
  return appAddress
    .toHexString()
    .concat('-')
    .concat(roleHash.toHexString())
    .concat('-')
    .concat(granteeAddress.toHexString())
}

function loadOrCreatePermission(
  appAddress: Address,
  roleHash: Bytes,
  granteeAddress: Address
): PermissionEntity {
  const permissionId = buildPermissionId(appAddress, roleHash, granteeAddress)
  let permission = PermissionEntity.load(permissionId)
  if (permission === null) {
    permission = new PermissionEntity(permissionId)
    permission.granteeAddress = granteeAddress
    permission.allowed = false
    permission.params = []
    permission.appAddress = appAddress
    permission.role = buildRoleId(appAddress, roleHash)
    permission.roleHash = roleHash
  }
  return permission!
}

function buildParamId(paramHash: Bytes, index: number): string {
  return paramHash.toHexString().concat('-').concat(index.toString())
}

function loadOrCreateParam(
  appAddress: Address,
  roleHash: Bytes,
  granteeAddress: Address,
  paramHash: Bytes,
  index: BigInt,
  acl: AclContract
): ParamEntity {
  const paramId = buildParamId(paramHash, index.toI32())
  let param = ParamEntity.load(paramId)
  if (param === null) {
    param = new ParamEntity(paramId)

    const paramData = acl.getPermissionParam(
      granteeAddress,
      appAddress,
      roleHash,
      index
    )

    param.argumentId = paramData.value0
    param.operationType = paramData.value1
    param.argumentValue = paramData.value2
  }
  return param!
}
