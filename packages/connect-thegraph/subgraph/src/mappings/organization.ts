import { Address, Bytes, BigInt } from '@graphprotocol/graph-ts'

import { resolveRepo } from '../helpers/ens'
import { isForwarder } from '../helpers/appProxy'

// Import entity types from the schema
import {
  Organization as OrganizationEntity,
  Repo as RepoEntity,
  App as AppEntity,
  Implementation as ImplementationEntity,
} from '../../generated/schema'

// Import templates types
import {
  NewAppProxy as NewAppProxyEvent,
  SetApp as SetAppEvent,
  Kernel as KernelContract,
} from '../../generated/templates/Kernel/Kernel'
import { Acl as AclTemplate } from '../../generated/templates'

// Default APP_IDs
import {
  KERNEL_APP_BASES_NAMESPACE,
  KERNEL_CORE_NAMESPACE,
  KERNEL_CORE_APP_ID,
  KERNEL_DEFAULT_ACL_APP_ID,
  EVM_SCRIPT_REGISTRY_APP_ID,
} from '../helpers/constants'

/* eslint-disable @typescript-eslint/no-use-before-define */

export function handleNewProxyApp(event: NewAppProxyEvent): void {
  const orgAddress = event.address
  const org = loadOrCreateOrg(orgAddress, event.block.timestamp)

  const proxyAddress = event.params.proxy
  const appId = event.params.appId
  const app = loadOrCreateApp(proxyAddress, appId, event.params.isUpgradeable)

  // Handle system apps
  // ACL
  if (appId.toHexString() == KERNEL_DEFAULT_ACL_APP_ID) {
    addKernelApp(orgAddress, org)
    AclTemplate.create(proxyAddress)
    app.name = 'acl'
  }
  // EVM Script Registry
  if (appId.toHexString() == EVM_SCRIPT_REGISTRY_APP_ID) {
    app.name = 'evm-script-registry'
  }

  const orgApps = org.apps
  orgApps.push(app.id)
  org.apps = orgApps

  org.save()
  app.save()
}

export function handleSetApp(event: SetAppEvent): void {
  const namespace = event.params.namespace.toHexString()
  // Update if in the APP_BASE or CORE_BASE namespace
  if (
    namespace == KERNEL_APP_BASES_NAMESPACE ||
    namespace == KERNEL_CORE_NAMESPACE
  ) {
    const appId = event.params.appId.toHexString()

    const implementation = loadOrCreateImplementation(namespace, appId)
    implementation.address = event.params.app

    implementation.save()
  }
}

export function loadOrCreateOrg(
  orgAddress: Address,
  createAt: BigInt
): OrganizationEntity {
  const orgId = orgAddress.toHexString()
  let org = OrganizationEntity.load(orgId)
  if (org === null) {
    org = new OrganizationEntity(orgId)

    const kernel = KernelContract.bind(orgAddress)

    org.address = orgAddress
    org.recoveryVault = kernel.getRecoveryVault()
    org.acl = kernel.acl()
    org.apps = []
    org.permissions = []
    org.createdAt = createAt
  }
  return org!
}

function loadOrCreateApp(
  proxyAddress: Address,
  appId: Bytes,
  isUpgradeable: boolean
): AppEntity {
  const proxyAppId = proxyAddress.toHexString()
  // Create app
  let app = AppEntity.load(proxyAppId)
  if (app === null) {
    app = new AppEntity(proxyAppId)

    app.address = proxyAddress
    app.name = ''
    app.appId = appId.toHexString()
    app.implementation = buildImplementationId(
      KERNEL_APP_BASES_NAMESPACE,
      appId.toHexString()
    )
    app.isForwarder = isForwarder(proxyAddress)
    app.isUpgradeable = isUpgradeable

    // Use ens to resolve repo
    const repoId = resolveRepo(appId)
    if (repoId) {
      const repo = RepoEntity.load(repoId)
      if (repo !== null) {
        app.version = repo.versions.pop()
        app.repo = repo.id
        app.name = repo.name
        repo.appCount += 1
        repo.save()
      }
    }
  }
  return app!
}

function addKernelApp(kernelProxy: Address, org: OrganizationEntity): void {
  // handle kernel implementation
  const implementation = loadOrCreateImplementation(
    KERNEL_CORE_NAMESPACE,
    KERNEL_CORE_APP_ID
  )

  const kernel = KernelContract.bind(kernelProxy)
  implementation.address = kernel.getApp(
    Bytes.fromHexString(KERNEL_CORE_NAMESPACE) as Bytes,
    Bytes.fromHexString(KERNEL_CORE_APP_ID) as Bytes
  )

  implementation.save()

  // handle kernel proxy app
  const app = new AppEntity(kernelProxy.toHex())
  app.address = kernelProxy
  app.appId = KERNEL_CORE_APP_ID
  app.name = 'kernel'
  app.implementation = implementation.id
  app.isForwarder = false
  app.isUpgradeable = true

  const orgApps = org.apps
  orgApps.push(app.id)
  org.apps = orgApps

  app.save()
}

function buildImplementationId(namespace: string, appId: string): string {
  return namespace.concat('-').concat(appId)
}

function loadOrCreateImplementation(
  namespace: string,
  appId: string
): ImplementationEntity {
  const implementationId = buildImplementationId(namespace, appId)
  let implementation = ImplementationEntity.load(implementationId)
  if (implementation === null) {
    implementation = new ImplementationEntity(implementationId)
  }
  return implementation!
}
