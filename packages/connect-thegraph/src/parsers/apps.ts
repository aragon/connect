import {
  App,
  AppData,
  ErrorNotFound,
  ErrorUnexpectedResult,
  Organization,
} from '@aragon/connect-core'
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

  if (app === null) {
    throw new ErrorNotFound('No app found.')
  }

  if (!app) {
    throw new ErrorUnexpectedResult('Unable to parse app.')
  }

  return _parseApp(app, organization)
}

export async function parseApps(
  result: QueryResult,
  organization: Organization
): Promise<App[]> {
  const data = result?.data
  const apps = data?.organization?.apps

  if (!apps || data?.organization === null) {
    throw new ErrorUnexpectedResult('Unable to parse apps.')
  }

  return Promise.all(
    apps.map(async (app: any) => {
      return _parseApp(app, organization)
    })
  )
}
