import { Address, Bytes } from '@graphprotocol/graph-ts'

// Import entity types from the schema
import {
  Registry as RegistryEntity,
  Repo as RepoEntity,
} from '../../generated/schema'

// Import templates types
import { Repo as RepoTemplate } from '../../generated/templates'

// Import event types from the contract ABI
import { NewRepo as NewRepoEvent } from '../../generated/templates/Registry/APMRegistry'

import {
  APM_REGISTRY_NODE,
  OPEN_REGISTRY_NODE,
  HATCH_REGISTRY_NODE,
  HIVE_REGISTRY_NODE,
} from '../helpers/constants'

/* eslint-disable @typescript-eslint/no-use-before-define */

export function handleNewRepo(event: NewRepoEvent): void {
  const registryAddress = event.address
  const registry = loadOrCreateRegistry(
    registryAddress,
    Bytes.fromUTF8('0') as Bytes
  )

  const repoAddress = event.params.repo
  const repo = loadOrCreateRepo(repoAddress, event.params.name, event.params.id)

  // add the repo to the registry
  const currentRepos = registry.repos
  currentRepos.push(repo.id)
  registry.repos = currentRepos

  registry.repoCount = registry.repoCount + 1

  // save to the store
  registry.save()
  repo.save()

  RepoTemplate.create(repoAddress)
}

export function loadOrCreateRegistry(
  registryAddress: Address,
  node: Bytes
): RegistryEntity {
  const registryId = registryAddress.toHexString()
  let registry = RegistryEntity.load(registryId)
  if (registry === null) {
    registry = new RegistryEntity(registryId)

    // solve registry name
    let name = ''
    if (node.toHex() == APM_REGISTRY_NODE) {
      name = 'aragonpm.eth'
    } else if (node.toHex() == OPEN_REGISTRY_NODE) {
      name = 'open.aragonpm.eth'
    } else if (node.toHex() == HATCH_REGISTRY_NODE) {
      name = 'hatch.aragonpm.eth'
    } else if (node.toHex() == HIVE_REGISTRY_NODE) {
      name = '1hive.aragonpm.eth'
    }

    registry.address = registryAddress
    registry.name = name
    registry.node = node
    registry.repoCount = 0
    registry.repos = []
  }
  return registry
}

export function loadOrCreateRepo(
  repoAddress: Address,
  name: string,
  node: Bytes
): RepoEntity {
  const repoId = repoAddress.toHexString()
  let repo = RepoEntity.load(repoId)
  if (repo === null) {
    repo = new RepoEntity(repoId)
    repo.address = repoAddress
    repo.name = name
    repo.node = node
    repo.versions = []
    repo.appCount = 0
  }
  return repo
}
