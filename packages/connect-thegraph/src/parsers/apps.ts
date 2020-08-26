import { App, AppData, Organization } from '@aragon/connect-core'
import { QueryResult } from '../types'

async function _parseApp(app: any, organization: Organization): Promise<App> {
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

  return App.create(data, organization)
}

export async function parseApp(
  result: QueryResult,
  organization: Organization
): Promise<App> {
  const app = result?.data?.app

  if (!app) {
    throw new Error('Unable to parse app.')
  }

  return _parseApp(app, organization)
}

export async function parseApps(
  result: QueryResult,
  organization: Organization
): Promise<App[]> {
  const data = result?.data
  const apps = data?.organization?.apps

  if (data?.organization === null || apps?.length === 0) {
    throw new Error('No apps found with the current filters.')
  }

  if (!apps) {
    throw new Error('Unable to parse apps.')
  }

  return Promise.all(
    apps.map(async (app: any) => {
      return _parseApp(app, organization)
    })
  )
}
