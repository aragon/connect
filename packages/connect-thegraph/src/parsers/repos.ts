import { Repo, RepoData } from '@aragon/connect-core'
import { App as AppDataGql } from '../queries/types'
import { Repo as RepoDataGql } from '../queries/types'
import { QueryResult } from '../types'

export function parseRepo(
  result: QueryResult,
  connector: any
): Repo {
  const app = result.data.app as AppDataGql
  const repo = app.repo as RepoDataGql

  if (!repo) {
    throw new Error('Unable to parse repo.')
  }

  const data: RepoData = {
    address: repo.address,
    artifact: repo.lastVersion?.artifact,
    contentUri: repo.lastVersion?.contentUri,
    manifest: repo.lastVersion?.manifest,
    name: repo.name,
    registry: repo.registry?.name
  }

  return new Repo(data, connector)
}
