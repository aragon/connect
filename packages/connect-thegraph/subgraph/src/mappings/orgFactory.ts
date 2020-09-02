import { Bytes, Address } from '@graphprotocol/graph-ts'

// Import event types from the contract ABI
import { DeployDAO as DeployDAOEvent } from '../../generated/DaoFactory/DAOFactory'

// Import entity types from the schema
import {
  App as AppEntity,
  Implementation as ImplementationEntity,
  OrgFactory as FactoryEntity,
  Organization as OrganizationEntity,
} from '../../generated/schema'

// Import templates types
import {
  Acl as AclTemplate,
  Kernel as OrganizationTemplate,
} from '../../generated/templates'
import { Kernel as KernelContract } from '../../generated/templates/Kernel/Kernel'

// Default APP_IDs
import {
  KERNEL_CORE_APP_ID,
  KERNEL_APP_ADDR_NAMESPACE,
  KERNEL_APP_BASES_NAMESPACE,
  KERNEL_DEFAULT_ACL_APP_ID,
  EVM_SCRIPT_REGISTRY_APP_ID,
  KERNEL_CORE_NAMESPACE,
  ZERO_ADDR,
} from '../helpers/constants'

function addApp(
  namespace: string,
  appId: string,
  address: Address,
  name: string,
  kernel: KernelContract,
  org: OrganizationEntity
): void {
  // handle implementation
  const implementationId = namespace.concat('-').concat(appId)
  let implementation = ImplementationEntity.load(implementationId)
  if (implementation == null) {
    implementation = new ImplementationEntity(implementationId)
    implementation.address = kernel.getApp(
      Bytes.fromHexString(namespace) as Bytes,
      Bytes.fromHexString(appId) as Bytes
    )
    implementation.save()
  }

  // handle app
  const app = new AppEntity(address.toHexString())
  app.address = address
  app.appId = appId
  app.implementation = implementationId
  app.repoName = name

  const orgApps = org.apps
  orgApps.push(app.id)
  org.apps = orgApps
  org.save()

  app.save()
}

function addSystemApps(
  orgAddress: Address,
  aclAddress: Address,
  kernel: KernelContract,
  org: OrganizationEntity
): void {
  // Add Kernel
  addApp(
    KERNEL_CORE_NAMESPACE,
    KERNEL_CORE_APP_ID,
    orgAddress,
    'kernel',
    kernel,
    org
  )

  // Add ACL
  addApp(
    KERNEL_APP_BASES_NAMESPACE,
    KERNEL_DEFAULT_ACL_APP_ID,
    aclAddress,
    'acl',
    kernel,
    org
  )

  // Add EVM Script Registry
  const evmScriptRegistryAddres = kernel.getApp(
    Bytes.fromHexString(KERNEL_APP_ADDR_NAMESPACE) as Bytes,
    Bytes.fromHexString(EVM_SCRIPT_REGISTRY_APP_ID) as Bytes
  )

  if (evmScriptRegistryAddres.toString() != ZERO_ADDR) {
    addApp(
      KERNEL_APP_BASES_NAMESPACE,
      EVM_SCRIPT_REGISTRY_APP_ID,
      evmScriptRegistryAddres,
      'evm-script-registry',
      kernel,
      org
    )
  }
}

export function handleDeployDAO(event: DeployDAOEvent): void {
  let factory = FactoryEntity.load('1')
  const factoryAddress = event.address

  // if no factory yet, set up empty
  if (factory == null) {
    factory = new FactoryEntity('1')
    factory.address = factoryAddress
    factory.orgCount = 0
    factory.organizations = []
  }
  factory.orgCount = factory.orgCount + 1

  // create new org
  const orgId = event.params.dao.toHexString()
  const org = new OrganizationEntity(orgId)
  const orgAddress = event.params.dao
  const kernel = KernelContract.bind(orgAddress)

  const aclAddress = kernel.acl()

  // Load org data
  org.address = orgAddress
  org.recoveryVault = kernel.getRecoveryVault()
  org.acl = aclAddress
  org.apps = []
  org.permissions = []
  org.createdAt = event.block.timestamp

  // add the org to the factory
  const currentOrganizations = factory.organizations
  currentOrganizations.push(org.id)
  factory.organizations = currentOrganizations

  // save to the store
  factory.save()
  org.save()

  OrganizationTemplate.create(orgAddress)

  // Create ACL template and add System apps
  AclTemplate.create(aclAddress)
  addSystemApps(orgAddress, aclAddress, kernel, org)
}
