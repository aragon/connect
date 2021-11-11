import { ipfs } from '@graphprotocol/graph-ts'

export function getAppMetadata(
  contentUri: string,
  fileName: string
): string | null {
  const contentLocation = contentUri.split(':')[0]

  if (contentLocation == 'ipfs') {
    const contentHash = contentUri.split(':')[1]

    if (
      contentHash != 'repo' &&
      contentHash != 'enssub' &&
      contentHash != 'apm'
    ) {
      const ipfsPath = contentHash.concat('/').concat(fileName)

      const rawData = ipfs.cat(ipfsPath)

      if (rawData === null) {
        return null
      }

      return rawData.toString()
    }
  }
  return null
}
