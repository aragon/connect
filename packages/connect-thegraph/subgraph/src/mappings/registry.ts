// Import entity types from the schema
import {
  Registry as RegistryEntity,
  Repo as RepoEntity,
} from '../../generated/schema'

// Import templates types
import { Repo as RepoTemplate } from '../../generated/templates'

// Import event types from the contract ABI
import { NewRepo as NewRepoEvent } from '../../generated/templates/Registry/APMRegistry'

export function handleNewRepo(event: NewRepoEvent): void {
  const registryId = event.address.toHex()
  const registryAddress = event.address
  let registry = RegistryEntity.load(registryId)

  if (registry == null) {
    registry = new RegistryEntity(registryId)
    registry.address = registryAddress
    registry.repoCount = 0
    registry.repos = []
  }

  registry.repoCount = registry.repoCount + 1

  const repoId = event.params.repo.toHex()
  const repoAddress = event.params.repo

  // create new repo
  let repo = RepoEntity.load(repoId)
  if (repo == null) {
    repo = new RepoEntity(repoId)
    repo.address = repoAddress
    repo.name = event.params.name
    repo.node = event.params.id
    repo.versions = []
    repo.appCount = 0
  }

  // add the repo to the registry
  const currentRepos = registry.repos
  currentRepos.push(repo.id)
  registry.repos = currentRepos

  // save to the store
  registry.save()
  repo.save()

  RepoTemplate.create(repoAddress)
}
