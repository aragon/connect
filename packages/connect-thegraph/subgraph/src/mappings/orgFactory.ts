// Import event types from the contract ABI
import { DeployDAO as DeployDAOEvent } from '../../generated/DaoFactory/DAOFactory'

// Import entity types from the schema
import {
  OrgFactory as FactoryEntity,
  Organization as OrganizationEntity,
} from '../../generated/schema'

// Import templates types
import { Kernel as OrganizationTemplate } from '../../generated/templates'
import { Kernel as KernelContract } from '../../generated/templates/Kernel/Kernel'

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

  const orgId = event.params.dao.toHexString()
  const orgAddress = event.params.dao

  let kernel = KernelContract.bind(orgAddress)

  // create new org
  const org = new OrganizationEntity(orgId)
  org.address = orgAddress
  org.recoveryVault = kernel.getRecoveryVault()
  org.acl = kernel.acl()
  org.apps = []
  org.permissions = []

  // add the org to the factory
  const currentOrganizations = factory.organizations
  currentOrganizations.push(org.id)
  factory.organizations = currentOrganizations

  // save to the store
  factory.save()
  org.save()

  OrganizationTemplate.create(orgAddress)
}
