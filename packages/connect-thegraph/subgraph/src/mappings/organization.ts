import { resolveRepo } from '../helpers/ens'

// Import entity types from the schema
import {
  Organization as OrganizationEntity,
  Repo as RepoEntity,
  App as AppEntity,
  Implementation as ImplementationEntity,
} from '../../generated/schema'

// Import templates types
import { AppProxyForwarder as AppProxyForwarderContract } from '../../generated/templates/Kernel/AppProxyForwarder'
import {
  NewAppProxy as NewAppProxyEvent,
  SetApp as SetAppEvent,
  Kernel as KernelContract,
} from '../../generated/templates/Kernel/Kernel'

import {
  KERNEL_APP_BASES_NAMESPACE,
  KERNEL_CORE_NAMESPACE,
} from '../helpers/constants'

export function handleNewProxyApp(event: NewAppProxyEvent): void {
  const orgAddress = event.address
  const orgId = orgAddress.toHexString()
  let org = OrganizationEntity.load(orgId)

  const kernel = KernelContract.bind(orgAddress)

  if (org == null) {
    org = new OrganizationEntity(orgId)
    org.address = orgAddress
    org.recoveryVault = kernel.getRecoveryVault()
    org.acl = kernel.acl()
    org.apps = []
    org.permissions = []
  }

  const proxy = event.params.proxy.toHexString()
  const appId = event.params.appId.toHexString()
  const isUpgradeable = event.params.isUpgradeable

  // Create app
  let app = AppEntity.load(proxy)
  if (app == null) {
    // Check if app is forwarder
    let isForwarder: boolean
    const appForwarder = AppProxyForwarderContract.bind(event.params.proxy)
    const callForwarderResult = appForwarder.try_isForwarder()
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
        repo.appCount += 1
        repo.save()
      }
    }

    const orgApps = org.apps
    orgApps.push(app.id)
    org.apps = orgApps

    app.save()
    org.save()
  }
}

export function handleSetApp(event: SetAppEvent): void {
  const namespace = event.params.namespace.toHexString()
  // Update if in the APP_BASE or CORE_BASE namespace
  if (
    namespace == KERNEL_APP_BASES_NAMESPACE ||
    namespace == KERNEL_CORE_NAMESPACE
  ) {
    const appId = event.params.appId.toHexString()

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
