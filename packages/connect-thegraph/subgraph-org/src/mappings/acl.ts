import { BigInt } from '@graphprotocol/graph-ts'

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

export function handleSetPermission(event: SetPermissionEvent): void {
  const acl = AclContract.bind(event.address)
  const orgAddress = acl.kernel()
  const orgId = orgAddress.toHex()
  const org = OrganizationEntity.load(orgId)

  const appAddress = event.params.app
  const roleHash = event.params.role
  const granteeAddress = event.params.entity

  // Generate role id
  const roleId = appAddress
    .toHexString()
    .concat('-')
    .concat(roleHash.toHexString())

  // If no Role yet create new one
  let role = RoleEntity.load(roleId)
  if (role == null) {
    role = new RoleEntity(roleId)
    role.roleHash = roleHash
    role.app = appAddress.toHex()
    role.appAddress = appAddress
  }

  // Update permission
  const permissionId = appAddress
    .toHexString()
    .concat('-')
    .concat(roleHash.toHexString())
    .concat('-')
    .concat(granteeAddress.toHexString())

  // if no Permission yet create new one
  let permission = PermissionEntity.load(permissionId)
  if (permission == null) {
    permission = new PermissionEntity(permissionId)
    permission.appAddress = appAddress
    permission.role = roleId
    permission.roleHash = roleHash
    permission.granteeAddress = event.params.entity
    permission.params = []

    // update org permissions
    const orgPermissions = org.permissions
    orgPermissions.push(permission.id)
    org.permissions = orgPermissions

    org.save()
  }
  permission.allowed = event.params.allowed

  permission.save()
  role.save()
}

export function handleChangePermissionManager(
  event: ChangePermissionManagerEvent
): void {
  const appAddress = event.params.app
  const roleHash = event.params.role

  // get role id and load from store
  const roleId = appAddress
    .toHexString()
    .concat('-')
    .concat(roleHash.toHexString())

  let role = RoleEntity.load(roleId)
  if (role == null) {
    role = new RoleEntity(roleId)
    role.roleHash = roleHash
    role.app = appAddress.toHex()
    role.appAddress = appAddress
  }

  // Update values
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

  // get permission id and load from store
  const permissionId = appAddress
    .toHexString()
    .concat('-')
    .concat(roleHash.toHexString())
    .concat('-')
    .concat(granteeAddress.toHexString())

  // We know the permission exists because the smart contract always
  // emit handleSetPermission first
  const permission = PermissionEntity.load(permissionId)

  // get params length
  const paramsLength = acl
    .getPermissionParamsLength(granteeAddress, appAddress, roleHash)
    .toI32()

  const paramHash = event.params.paramsHash

  // iterate getting the params
  for (let index = 0; index < paramsLength; index++) {
    const paramData = acl.getPermissionParam(
      granteeAddress,
      appAddress,
      roleHash,
      BigInt.fromI32(index)
    )

    // get param id and create new entity
    const paramId = paramHash.toHexString().concat('-').concat(index.toString())

    let param = ParamEntity.load(paramId)
    if (param == null) {
      param = new ParamEntity(paramId)
      param.argumentId = paramData.value0
      param.operationType = paramData.value1
      param.argumentValue = paramData.value2
    }

    // update permission params
    const permissionParams = permission.params
    permissionParams.push(param.id)
    permission.params = permissionParams

    // save param to the store
    param.save()
  }

  permission.save()
}
