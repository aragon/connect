import { Address, BigInt, Bytes, log } from '@graphprotocol/graph-ts'

// Import entity types from the schema
import {
  Repo as RepoEntity,
  Version as VersionEntity,
} from '../../generated/schema'

// Import templates types
import {
  NewVersion as NewVersionEvent,
  Repo as RepoContract,
} from '../../generated/templates/Repo/Repo'

import { ZERO_ADDR } from '../helpers/constants'

/* eslint-disable @typescript-eslint/no-use-before-define */

export function handleNewVersion(event: NewVersionEvent): void {
  const repoAddress = event.address
  const repo = RepoEntity.load(repoAddress.toHexString())
  if (repo !== null) {
    const semanticVersion = event.params.semanticVersion.toString()

    const version = loadOrCreateVersion(
      repoAddress,
      semanticVersion,
      event.params.versionId
    )

    // update repo info
    version.repoName = repo.name
    version.repoAddress = repo.address
    version.repoNamehash = repo.node

    // update repo last version
    repo.lastVersion = version.id

    // add the version to the repo
    const currentVersions = repo.versions
    currentVersions.push(version.id)
    repo.versions = currentVersions

    repo.save()
    version.save()
  }
}

function buildVersionId(repoId: string, semanticVersion: string): string {
  return repoId.concat('-').concat(semanticVersion)
}

function loadOrCreateVersion(
  repo: Address,
  semanticVersion: string,
  versionContractId: BigInt
): VersionEntity {
  const versionId = buildVersionId(repo.toHexString(), semanticVersion)
  // create new version
  let version = VersionEntity.load(versionId)
  if (version === null) {
    version = new VersionEntity(versionId)
    version.semanticVersion = semanticVersion
    version.codeAddress = Bytes.fromHexString(ZERO_ADDR) as Bytes
    version.contentUri = ''

    const repoContract = RepoContract.bind(repo)
    const callVersionResult = repoContract.try_getByVersionId(versionContractId)
    if (callVersionResult.reverted) {
      log.info('get repo version by id reverted', [])
    } else {
      const versionData = callVersionResult.value
      version.codeAddress = versionData.value1
      version.contentUri = versionData.value2.toString()
    }
  }
  return version!
}
