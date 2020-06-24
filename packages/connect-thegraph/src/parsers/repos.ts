import { Repository, RepoData } from '@aragon/connect-core'
import { QueryResult } from '../types'

export function parseRepo(
  result: QueryResult,
  connector: any
): Repository {
  const app = result.data.app
  const repo = app.repo

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

  return new Repository(data, connector)
}
