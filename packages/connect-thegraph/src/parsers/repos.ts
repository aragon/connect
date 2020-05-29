import { RepoData } from '@aragon/connect'
import { App as AppDataGql } from '../queries/types'
import { Repo as RepoDataGql } from '../queries/types'
import { QueryResult } from '../types'

export function parseRepo(result: QueryResult): RepoData {
  const app = result.data.app as AppDataGql
  const repo = app.repo as RepoDataGql

  if (!repo) {
    throw new Error('Unable to parse repo.')
  }

  return {
    address: repo.address,
    artifact: repo.lastVersion?.artifact,
    contentUri: repo.lastVersion?.contentUri,
    manifest: repo.lastVersion?.manifest,
    name: repo.name,
    registry: repo.registry?.name
  }
}
