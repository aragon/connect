import { ethers } from 'ethers'

import { DEFAULT_IPFS_GATEWAY } from '../params'

export function parseMetadata(name: string, metadata: string): any {
  let parsedMetaData
  try {
    parsedMetaData = JSON.parse(metadata)
  } catch (error) {
    throw new Error(`Can't parse ${name} file, invalid JSON.`)
  }
  return parsedMetaData
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
      metadata = await ethers.utils.fetchJson(url)
    } catch (error) {
      throw new Error(`Can't fetch ${url}, failed with error: {error}.`)
    }
    return metadata
  }
  return {}
}

export async function resolveMetadata(
  fileName: string,
  contentUri?: string,
  metadata?: string | null
): Promise<any> {
  if (metadata) return parseMetadata(fileName, metadata)
  if (contentUri) return fetchMetadata(fileName, contentUri)
  return {}
}
