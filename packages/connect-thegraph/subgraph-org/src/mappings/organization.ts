import { Bytes, Address } from '@graphprotocol/graph-ts'

import { resolveRepo } from '../helpers/ens'

// Import entity types from the schema
import {
  Organization as OrganizationEntity,
  Repo as RepoEntity,
  App as AppEntity,
  Implementation as ImplementationEntity,
} from '../../generated/schema'

// Import templates types
import { Acl as AclTemplate } from '../../generated/templates'
import { AppProxyForwarder as AppProxyForwarderContract } from '../../generated/templates/Kernel/AppProxyForwarder'
import {
  NewAppProxy as NewAppProxyEvent,
  SetApp as SetAppEvent,
  Kernel as KernelContract,
} from '../../generated/templates/Kernel/Kernel'

import {
  KERNEL_CORE_APP_ID,
  KERNEL_DEFAULT_ACL_APP_ID,
  KERNEL_APP_BASES_NAMESPACE,
  KERNEL_CORE_NAMESPACE,
} from '../helpers/constants'

export function handleNewProxyApp(event: NewAppProxyEvent): void {
  const orgAddress = event.address
  const orgId = orgAddress.toHex()
  let org = OrganizationEntity.load(orgId)

  let kernel = KernelContract.bind(orgAddress)

  if (org == null) {
    org = new OrganizationEntity(orgId)
    org.address = orgAddress
    org.recoveryVault = kernel.getRecoveryVault()
    org.acl = kernel.acl()
    org.apps = []
    org.permissions = []
  }

  const proxy = event.params.proxy.toHex()
  const appId = event.params.appId.toHex()
  const isUpgradeable = event.params.isUpgradeable

  // Create ACL template and add Kernel app
  if (appId == KERNEL_DEFAULT_ACL_APP_ID) {
    _addKernelApp(orgAddress, kernel, org as OrganizationEntity)
    AclTemplate.create(event.params.proxy)
  }

  // Create app
  let app = AppEntity.load(proxy)
  if (app == null) {
    // Check if app is forwarder
    let isForwarder: boolean
    const appForwarder = AppProxyForwarderContract.bind(event.params.proxy)
    let callForwarderResult = appForwarder.try_isForwarder()
    if (callForwarderResult.reverted) {
      isForwarder = false
    } else {
      isForwarder = callForwarderResult.value
    }

    // Generate implementation id
    const implementationId = KERNEL_APP_BASES_NAMESPACE.concat('-').concat(
      appId
    )

    app = new AppEntity(proxy)
    app.address = event.params.proxy
    app.appId = appId
    app.isForwarder = isForwarder
    app.isUpgradeable = isUpgradeable
    app.implementation = implementationId
    // Use ens to resolve repo
    const repoId = resolveRepo(event.params.appId)
    if (repoId) {
      const repo = RepoEntity.load(repoId)
      if (repo !== null) {
        app.version = repo.lastVersion
        app.repo = repo.id
        app.repoName = repo.name
        app.repoAddress = repo.address
      }
    }
  }

  const orgApps = org.apps
  orgApps.push(app.id)
  org.apps = orgApps

  app.save()
  org.save()
}

export function handleSetApp(event: SetAppEvent): void {
  const namespace = event.params.namespace.toHex()
  // Update if in the APP_BASE or CORE_BASE namespace
  if (
    namespace == KERNEL_APP_BASES_NAMESPACE ||
    namespace == KERNEL_CORE_NAMESPACE
  ) {
    const appId = event.params.appId.toHex()

    // Generate implementation id
    const implementationId = namespace.concat('-').concat(appId)

    // Create implementation
    let implementation = ImplementationEntity.load(implementationId)
    if (implementation == null) {
      implementation = new ImplementationEntity(implementationId)
    }
    implementation.address = event.params.app

    implementation.save()
  }
}

function _addKernelApp(
  kernelProxyAddress: Address,
  kernel: KernelContract,
  org: OrganizationEntity
): void {
  // handle kernel implementation
  const implementationId = KERNEL_CORE_NAMESPACE.concat('-').concat(
    KERNEL_CORE_APP_ID
  )
  let implementation = ImplementationEntity.load(implementationId)
  if (implementation == null) {
    implementation = new ImplementationEntity(implementationId)
    implementation.address = kernel.getApp(
      Bytes.fromHexString(KERNEL_CORE_NAMESPACE) as Bytes,
      Bytes.fromHexString(KERNEL_CORE_APP_ID) as Bytes
    )
    implementation.save()
  }

  // handle kernel implementation
  const app = new AppEntity(kernelProxyAddress.toHex())
  app.address = kernelProxyAddress
  app.appId = KERNEL_CORE_APP_ID
  app.implementation = implementationId

  const orgApps = org.apps
  orgApps.push(app.id)
  org.apps = orgApps

  app.save()
}
