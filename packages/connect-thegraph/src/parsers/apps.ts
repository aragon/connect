import { AppData } from '@aragon/connect'
import { App as AppDataGql } from '../queries/types'
import { Organization as OrganizationDataGql } from '../queries/types'
import { QueryResult } from '../types'

function _parseApp(app: AppDataGql): AppData {
  return {
    address: app.address,
    appId: app.appId,
    artifact: app.version?.artifact,
    codeAddress: app.implementation.address,
    contentUri: app.version?.contentUri,
    isForwarder: app.isForwarder,
    isUpgradeable: app.isUpgradeable,
    kernelAddress: app.organization?.address,
    manifest: app.version?.manifest,
    name: app.repo?.name,
    registry: app.repo?.registry?.name,
    registryAddress: app.repo?.registry?.address,
    repoAddress: app.repo?.address,
    version: app.version?.semanticVersion.replace(/,/g, '.'),
  }
}

export function parseApp(result: QueryResult): AppData {
  const app = result.data.app as AppDataGql

  if (!app) {
    throw new Error('Unable to parse app.')
  }

  return _parseApp(app)
}

export function parseApps(result: QueryResult): AppData[] {
  const org = result.data.organization as OrganizationDataGql
  const apps = org?.apps

  if (!apps) {
    throw new Error('Unable to parse apps.')
  }

  return apps.map((app: AppDataGql) => {
    return _parseApp(app)
  })
}
