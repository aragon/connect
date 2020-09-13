import { Address } from '@graphprotocol/graph-ts'

// Import event types from the contract ABI
import { DeployAPM as DeployAPMEvent } from '../../generated/ApmRegistryFactory/APMRegistryFactory'

// Import entity types from the schema
import { RegistryFactory as RegistryFactoryEntity } from '../../generated/schema'

// Import templates types
import { Registry as RegistryTemplate } from '../../generated/templates'

import { loadOrCreateRegistry } from './registry'

/* eslint-disable @typescript-eslint/no-use-before-define */

export function handleDeployAPM(event: DeployAPMEvent): void {
  const factory = loadOrCreateApmFactory(event.address)

  const registryAddress = event.params.apm
  const registry = loadOrCreateRegistry(registryAddress, event.params.node)

  // add the registry to the factory
  const currentRegistries = factory.registries
  currentRegistries.push(registry.id)
  factory.registries = currentRegistries

  factory.registryCount = factory.registryCount + 1

  // save to the store
  factory.save()
  registry.save()

  RegistryTemplate.create(registryAddress)
}

function loadOrCreateApmFactory(
  factoryAddress: Address
): RegistryFactoryEntity {
  let factory = RegistryFactoryEntity.load('1')
  // if no factory yet, set up empty
  if (factory === null) {
    factory = new RegistryFactoryEntity('1')
    factory.address = factoryAddress
    factory.registryCount = 0
    factory.registries = []
  }
  return factory!
}
