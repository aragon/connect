import { QueryResult } from '@aragon/connect-thegraph'

import { VersionData } from '../../types'
import Version from '../../models/Version'

export function parseCurrentVersion(
  result: QueryResult,
  connector: any
): Version {
  const agreement = result.data.agreement

  if (!agreement || !agreement.currentVersion) {
    throw new Error('Unable to parse current version.')
  }

  return new Version(agreement.currentVersion, connector)
}

export function parseVersion(result: QueryResult, connector: any): Version {
  const version = result.data.version

  if (!version) {
    throw new Error('Unable to parse version.')
  }

  return new Version(version, connector)
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
