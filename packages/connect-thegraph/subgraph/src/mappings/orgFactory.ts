import { Address } from '@graphprotocol/graph-ts'

// Import event types from the contract ABI
import { DeployDAO as DeployDAOEvent } from '../../generated/DAOFactory/DAOFactory'

// Import entity types from the schema
import { OrgFactory as FactoryEntity } from '../../generated/schema'

// Import templates types
import { Kernel as OrganizationTemplate } from '../../generated/templates'

import { loadOrCreateOrg } from './organization'

/* eslint-disable @typescript-eslint/no-use-before-define */

export function handleDeployDAO(event: DeployDAOEvent): void {
  const factoryAddress = event.address
  const factory = loadOrCreateOrgFactory(factoryAddress)

  const orgAddress = event.params.dao
  const org = loadOrCreateOrg(orgAddress, event.block.timestamp)

  // add the org to the factory
  const currentOrganizations = factory.organizations
  currentOrganizations.push(org.id)
  factory.organizations = currentOrganizations

  factory.orgCount = factory.orgCount + 1

  // save to the store
  factory.save()
  org.save()

  OrganizationTemplate.create(orgAddress)
}

function loadOrCreateOrgFactory(factoryAddress: Address): FactoryEntity {
  let factory = FactoryEntity.load('1')
  // if no factory yet, set up empty
  if (factory === null) {
    factory = new FactoryEntity('1')
    factory.address = factoryAddress
    factory.orgCount = 0
    factory.organizations = []
  }
  return factory
}
