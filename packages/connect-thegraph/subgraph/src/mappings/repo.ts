import { log } from '@graphprotocol/graph-ts'

// Import entity types from the schema
import {
  Repo as RepoEntity,
  Version as VersionEntity,
} from '../../generated/schema'

import { getAppMetadata } from '../helpers/ipfs'

// Import templates types
import {
  NewVersion as NewVersionEvent,
  Repo as RepoContract,
} from '../../generated/templates/Repo/Repo'

export function handleNewVersion(event: NewVersionEvent): void {
  const repoId = event.address.toHex()
  const repo = RepoEntity.load(repoId)

  if (repo !== null) {
    const semanticVersion = event.params.semanticVersion.toString()

    const versionId = repoId.concat('-').concat(semanticVersion)

    // create new version
    let version = VersionEntity.load(versionId)
    if (version == null) {
      version = new VersionEntity(versionId)
      version.semanticVersion = semanticVersion
      version.repoName = repo.name
      version.repoAddress = repo.address
      version.repoNamehash = repo.node

      const repoContract = RepoContract.bind(event.address)
      let callVersionResult = repoContract.try_getByVersionId(
        event.params.versionId
      )
      if (callVersionResult.reverted) {
        log.info('get repo version by id reverted', [])
      } else {
        const versionData = callVersionResult.value
        const codeAddress = versionData.value1
        const contentUri = versionData.value2.toString()

        version.codeAddress = codeAddress
        version.contentUri = contentUri
        version.artifact = getAppMetadata(contentUri, 'artifact.json')
        version.manifest = getAppMetadata(contentUri, 'manifest.json')
      }

      // add the version to the repo
      const currentVersions = repo.versions
      currentVersions.push(version.id)
      repo.versions = currentVersions
    }

    // Update repo last version
    repo.lastVersion = version.id

    repo.save()
    version.save()
  }
}
