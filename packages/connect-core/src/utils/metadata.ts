import fetch from 'isomorphic-unfetch'
import { AragonArtifact, AragonManifest, IpfsResolver } from '../types'
import { ErrorConnection, ErrorInvalid, ErrorUnexpectedResult } from '../errors'
import {
  getApmInternalAppInfo,
  getAragonOsInternalAppInfo,
  hasAppInfo,
} from './overrides/index'

export function parseMetadata(name: string, metadata: string): any {
  try {
    return JSON.parse(metadata)
  } catch (error) {
    throw new ErrorInvalid(`Can’t parse ${name}: invalid JSON.`)
  }
}

export async function fetchMetadata(
  ipfs: IpfsResolver,
  fileName: string,
  contentUri: string
): Promise<object> {
  const cid = contentUri.match(/ipfs:(.*)/)?.[1]
  return cid ? ipfs.json(cid, fileName) : {}
}

export async function resolveMetadata(
  ipfs: IpfsResolver,
  fileName: string,
  contentUri?: string | null,
  metadata?: string | null
): Promise<any> {
  if (metadata) {
    return parseMetadata(fileName, metadata)
  }
  if (contentUri) {
    return fetchMetadata(ipfs, fileName, contentUri)
  }
  return {}
}

export async function resolveManifest(
  ipfs: IpfsResolver,
  data: {
    contentUri?: string
    manifest?: string | null
  }
): Promise<AragonManifest> {
  return resolveMetadata(ipfs, 'manifest.json', data.contentUri, data.manifest)
}

export async function resolveArtifact(
  ipfs: IpfsResolver,
  data: {
    appId?: string
    artifact?: string | null
    contentUri?: string
  }
): Promise<AragonArtifact> {
  if (data.appId && hasAppInfo(data.appId, 'apm')) {
    return getApmInternalAppInfo(data.appId)
  }
  if (data.appId && hasAppInfo(data.appId, 'aragon')) {
    return getAragonOsInternalAppInfo(data.appId)
  }
  return resolveMetadata(ipfs, 'artifact.json', data.contentUri, data.artifact)
}
