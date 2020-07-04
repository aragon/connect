import { Repo, RepoData } from '@aragon/connect-core'
import { QueryResult } from '../types'

export async function parseRepo(
  result: QueryResult,
  connector: any
): Promise<Repo> {
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
    registry: repo.registry?.name,
    registryAddress: app.repo?.registry?.address,
  }

  return Repo.create(data, connector)
}
