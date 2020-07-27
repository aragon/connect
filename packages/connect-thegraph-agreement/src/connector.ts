import { SubscriptionHandler } from '@aragon/connect-types'
import { GraphQLWrapper } from '@aragon/connect-thegraph'
import * as queries from './queries'
import Version from './entities/Version'
import { parseVersions, parseVersion } from './parsers'

export default class AgreementConnectorTheGraph extends GraphQLWrapper {
  async connect() {}

  async disconnect() {
    this.close()
  }

  async version(versionId: string, first: number, skip: number): Promise<Version> {
    return this.performQueryWithParser(
      queries.GET_VERSION('query'),
      { versionId, first, skip },
      parseVersion
    )
  }

  onVersion(versionId: string, callback: Function): SubscriptionHandler {
    return this.subscribeToQueryWithParser(
      queries.GET_VERSION('subscription'),
      { versionId, first: 1000, skip: 0 },
      callback,
      parseVersion
    )
  }

  async versions(agreement: string, first: number, skip: number): Promise<Version[]> {
    return this.performQueryWithParser(
      queries.ALL_VERSIONS('query'),
      { agreement, first, skip },
      parseVersions
    )
  }

  onVersions(agreement: string, callback: Function): SubscriptionHandler {
    return this.subscribeToQueryWithParser(
      queries.ALL_VERSIONS('subscription'),
      { agreement, first: 1000, skip: 0 },
      callback,
      parseVersions
    )
  }
}
