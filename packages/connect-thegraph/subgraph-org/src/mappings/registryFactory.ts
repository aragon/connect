// Import event types from the contract ABI
import { DeployAPM as DeployAPMEvent } from '../../generated/ApmRegistryFactory/APMRegistryFactory'

// Import entity types from the schema
import {
  RegistryFactory as RegistryFactoryEntity,
  Registry as RegistryEntity,
} from '../../generated/schema'

// Import templates types
import { Registry as RegistryTemplate } from '../../generated/templates'

import {
  APM_REGISTRY_NODE,
  OPEN_REGISTRY_NODE,
  HATCH_REGISTRY_NODE,
} from '../helpers/constants'

export function handleDeployAPM(event: DeployAPMEvent): void {
  let factory = RegistryFactoryEntity.load('1')
  const factoryAddress = event.address

  // if no factory yet, set up empty
  if (factory == null) {
    factory = new RegistryFactoryEntity('1')
    factory.address = factoryAddress
    factory.registryCount = 0
    factory.registries = []
  }
  factory.registryCount = factory.registryCount + 1

  const registryId = event.params.apm.toHex()
  const registryAddress = event.params.apm
  const node = event.params.node

  // solve registry name
  let name = ''
  if (node.toHex() == APM_REGISTRY_NODE) {
    name = 'aragonpm.eth'
  } else if (node.toHex() == OPEN_REGISTRY_NODE) {
    name = 'open.aragonpm.eth'
  } else if (node.toHex() == HATCH_REGISTRY_NODE) {
    name = 'hatch.aragonpm.eth'
  }

  // create new registry
  const registry = new RegistryEntity(registryId)
  registry.address = registryAddress
  registry.node = node
  registry.name = name
  registry.repoCount = 0
  registry.repos = []

  // add the registry to the factory
  const currentRegistries = factory.registries
  currentRegistries.push(registry.id)
  factory.registries = currentRegistries

  // save to the store
  factory.save()
  registry.save()

  RegistryTemplate.create(registryAddress)
}
