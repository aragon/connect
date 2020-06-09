import { ipfs, log } from '@graphprotocol/graph-ts'

// Import entity types from the schema
import { IpfsHash as IpfsHashEntity } from '../../generated/schema'

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
        log.warning('Content {} of {} was not resolved ', [
          ipfsPath,
          contentUri,
        ])

        // save hash to try to resolve later
        let hash = IpfsHashEntity.load(contentHash)
        if (hash == null) {
          hash = new IpfsHashEntity(contentHash) as IpfsHashEntity
        }
        hash.hash = contentHash
        hash.save()

        return null
      }

      return rawData.toString()
    }
  }
  return null
}
