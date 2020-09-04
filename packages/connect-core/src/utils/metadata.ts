import { utils as ethersUtils } from 'ethers'
import { AppData } from '../entities/App'
import { RepoData } from '../entities/Repo'
import { RoleData } from '../entities/Role'
import {
  getApmInternalAppInfo,
  getAragonOsInternalAppInfo,
  hasAppInfo,
} from './overrides/index'
import { DEFAULT_IPFS_GATEWAY } from '../params'
import { AragonArtifact, AragonManifest } from '../types'
import { ErrorInvalid, ErrorConnection } from '../errors'

export function parseMetadata(name: string, metadata: string): any {
  try {
    return JSON.parse(metadata)
  } catch (error) {
    throw new ErrorInvalid(`Can’t parse ${name}: invalid JSON.`)
  }
}

export async function fetchMetadata(
  fileName: string,
  contentUri: string
): Promise<any> {
  const contentHashRegEx = contentUri.match(/ipfs:(.*)/)
  if (contentHashRegEx) {
    const url = `${DEFAULT_IPFS_GATEWAY}/ipfs/${contentHashRegEx[1]}/${fileName}`
    let metadata
    try {
      metadata = await ethersUtils.fetchJson(url)
    } catch (error) {
      throw new ErrorConnection(`Couldn’t fetch ${url}, failed with error.`)
    }
    return metadata
  }
  return {}
}

export async function resolveMetadata(
  fileName: string,
  contentUri?: string | null,
  metadata?: string | null
): Promise<any> {
  if (metadata) {
    return parseMetadata(fileName, metadata)
  }
  if (contentUri) {
    return fetchMetadata(fileName, contentUri)
  }
  return {}
}

export async function resolveManifest(
  data: AppData | RepoData
): Promise<AragonManifest> {
  return resolveMetadata('manifest.json', data.contentUri, data.manifest)
}

export async function resolveArtifact(
  data: AppData | RoleData
): Promise<AragonArtifact> {
  if (hasAppInfo(data.appId, 'apm')) {
    return getApmInternalAppInfo(data.appId)
  }
  if (hasAppInfo(data.appId, 'aragon')) {
    return getAragonOsInternalAppInfo(data.appId)
  }
  return resolveMetadata('artifact.json', data.contentUri, data.artifact)
}
