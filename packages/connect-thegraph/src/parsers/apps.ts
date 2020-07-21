import { Network } from '@aragon/connect-types'
import { App, AppData, IOrganizationConnector } from '@aragon/connect-core'
import { QueryResult } from '../types'

async function _parseApp(
  app: any,
  connector: IOrganizationConnector
): Promise<App> {
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
    name: app.repoName,
    registry: app.repo?.registry?.name,
    registryAddress: app.repo?.registry?.address,
    repoAddress: app.repo?.address,
    version: app.version?.semanticVersion.replace(/,/g, '.'),
  }

  return App.create(data, connector)
}

export async function parseApp(
  result: QueryResult,
  connector: any
): Promise<App> {
  const app = result.data.app

  if (!app) {
    throw new Error('Unable to parse app.')
  }

  return _parseApp(app, connector)
}

export async function parseApps(
  result: QueryResult,
  connector: IOrganizationConnector
): Promise<App[]> {
  const org = result.data.organization
  const apps = org?.apps

  if (!apps) {
    throw new Error('Unable to parse apps.')
  }

  return Promise.all(
    apps.map(async (app: any) => {
      return _parseApp(app, connector)
    })
  )
}
