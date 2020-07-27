import { QueryResult } from '@aragon/connect-thegraph'
import Version, { VersionData } from '../entities/Version'

export function parseVersion(result: QueryResult, connector: any): Version {
  const versions = result.data.versions

  if (!versions && versions[0]) {
    throw new Error('Unable to parse version.')
  }

  return new Version(versions[0], connector)
}

export function parseVersions(result: QueryResult, connector: any): Version[] {
  const versions = result.data.versions

  if (!versions) {
    throw new Error('Unable to parse versions.')
  }

  return versions.map((data: VersionData) => {
    return new Version(data, connector)
  })
}
