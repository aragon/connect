import { SubscriptionHandler } from '@aragon/connect-types'
import { GraphQLWrapper } from '@aragon/connect-thegraph'
import * as queries from './queries'
import Vote from './entities/Vote'
import Cast from './entities/Cast'
import { parseVotes, parseCasts } from './parsers'

export default class VotingConnectorTheGraph {
  #gql: GraphQLWrapper

  constructor(subgraphUrl: string, verbose = false) {
    this.#gql = new GraphQLWrapper(subgraphUrl, verbose)
  }

  async votesForApp(
    appAddress: string,
    first: number,
    skip: number
  ): Promise<Vote[]> {
    return this.#gql.performQueryWithParser(
      queries.ALL_VOTES('query'),
      { appAddress, first, skip },
      result => parseVotes(result, this)
    )
  }

  onVotesForApp(appAddress: string, callback: Function): SubscriptionHandler {
    return this.#gql.subscribeToQueryWithParser(
      queries.ALL_VOTES('subscription'),
      { appAddress, first: 1000, skip: 0 },
      callback,
      result => parseVotes(result, this)
    )
  }

  async castsForVote(
    voteId: string,
    first: number,
    skip: number
  ): Promise<Cast[]> {
    return this.#gql.performQueryWithParser(
      queries.CASTS_FOR_VOTE('query'),
      { voteId, first, skip },
      result => parseCasts(result, this)
    )
  }

  onCastsForVote(voteId: string, callback: Function): SubscriptionHandler {
    return this.#gql.subscribeToQueryWithParser(
      queries.CASTS_FOR_VOTE('subscription'),
      { voteId, first: 1000, skip: 0 },
      callback,
      result => parseCasts(result, this)
    )
  }
}
