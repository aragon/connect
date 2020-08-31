import { Organization, Repo, RepoData } from '@aragon/connect-core'
import { QueryResult } from '../types'

export async function parseRepo(
  result: QueryResult,
  organization: Organization
): Promise<Repo> {
  const repo = result?.data?.app?.repo

  if (!repo) {
    throw new Error('Unable to parse repo.')
  }

  const data: RepoData = {
    address: repo?.address,
    artifact: repo?.lastVersion?.artifact,
    contentUri: repo?.lastVersion?.contentUri,
    lastVersion: repo?.lastVersion?.semanticVersion.replace(/,/g, '.'),
    manifest: repo?.lastVersion?.manifest,
    name: repo?.name,
    registry: repo?.registry?.name,
    registryAddress: repo?.registry?.address,
  }

  return Repo.create(data, organization)
}
