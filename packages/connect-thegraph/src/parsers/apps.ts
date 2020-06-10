import { App, AppData } from '@aragon/connect-core'
import { App as AppDataGql } from '../queries/types'
import { Organization as OrganizationDataGql } from '../queries/types'
import { QueryResult } from '../types'

function _parseApp(
  app: AppDataGql,
  connector: any
): App {
  const data: AppData = {
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

  return new App(data, connector)
}

export function parseApp(
  result: QueryResult,
  connector: any
): AppData {
  const app = result.data.app as AppDataGql

  if (!app) {
    throw new Error('Unable to parse app.')
  }

  return _parseApp(app, connector)
}

export function parseApps(
  result: QueryResult,
  connector: any
): AppData[] {
  const org = result.data.organization as OrganizationDataGql
  const apps = org?.apps

  if (!apps) {
    throw new Error('Unable to parse apps.')
  }

  return apps.map((app: AppDataGql) => {
    return _parseApp(app, connector)
  })
}
