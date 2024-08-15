import {
  SubscriptionCallback,
  SubscriptionHandler,
} from '@aragon/connect-types'
import { GraphQLWrapper, QueryResult } from '@aragon/connect-thegraph'
import { IVotingConnector } from '../types'
import Vote from '../models/Vote'
import Cast from '../models/Cast'
import Reward from '../models/Reward'
import * as queries from './queries'
import { parseVotes, parseCasts, parseRewards, parseCalls } from './parsers'
import Call from '../models/Call'

export function subgraphUrlFromChainId(chainId: number) {
  if (chainId === 1) {
    return 'https://api.thegraph.com/subgraphs/name/aragon/aragon-voting-mainnet'
  }
  if (chainId === 5) {
    return 'https://api.thegraph.com/subgraphs/name/aragon/aragon-voting-goerli'
  }
  if (chainId === 100) {
    return 'https://api.thegraph.com/subgraphs/name/aragon/aragon-voting-xdai'
  }
  return null
}

type VotingConnectorTheGraphConfig = {
  pollInterval?: number
  subgraphUrl?: string
  verbose?: boolean
}

export default class VotingConnectorTheGraph implements IVotingConnector {
  #gql: GraphQLWrapper

  constructor(config: VotingConnectorTheGraphConfig) {
    if (!config.subgraphUrl) {
      throw new Error(
        'VotingConnectorTheGraph requires subgraphUrl to be passed.'
      )
    }
    this.#gql = new GraphQLWrapper(config.subgraphUrl, {
      pollInterval: config.pollInterval,
      verbose: config.verbose,
    })
  }

  async disconnect() {
    this.#gql.close()
  }

  async votesForApp(
    appAddress: string,
    first: number,
    skip: number
  ): Promise<Vote[]> {
    return this.#gql.performQueryWithParser<Vote[]>(
      queries.ALL_VOTES('query'),
      { appAddress, first, skip },
      (result: QueryResult) => parseVotes(result, this)
    )
  }

  onVotesForApp(
    appAddress: string,
    first: number,
    skip: number,
    callback: SubscriptionCallback<Vote[]>
  ): SubscriptionHandler {
    return this.#gql.subscribeToQueryWithParser<Vote[]>(
      queries.ALL_VOTES('subscription'),
      { appAddress, first, skip },
      callback,
      (result: QueryResult) => parseVotes(result, this)
    )
  }

  async castsForVote(
    vote: string,
    first: number,
    skip: number
  ): Promise<Cast[]> {
    return this.#gql.performQueryWithParser(
      queries.CASTS_FOR_VOTE('query'),
      { vote, first, skip },
      (result: QueryResult) => parseCasts(result)
    )
  }

  onCastsForVote(
    vote: string,
    first: number,
    skip: number,
    callback: SubscriptionCallback<Cast[]>
  ): SubscriptionHandler {
    return this.#gql.subscribeToQueryWithParser<Cast[]>(
      queries.CASTS_FOR_VOTE('subscription'),
      { vote, first, skip },
      callback,
      (result: QueryResult) => parseCasts(result)
    )
  }

  async rewardsForVote(
    vote: string,
    first: number,
    skip: number
  ): Promise<Reward[]> {
    return this.#gql.performQueryWithParser(
      queries.REWARDS_FOR_VOTE('query'),
      { vote, first, skip },
      (result: QueryResult) => parseRewards(result)
    )
  }

  onRewardsForVote(
    vote: string,
    first: number,
    skip: number,
    callback: SubscriptionCallback<Reward[]>
  ): SubscriptionHandler {
    return this.#gql.subscribeToQueryWithParser<Reward[]>(
      queries.REWARDS_FOR_VOTE('subscription'),
      { vote, first, skip },
      callback,
      (result: QueryResult) => parseRewards(result)
    )
  }

  async callsForVote(
    vote: string,
    first: number,
    skip: number
  ): Promise<Call[]> {
    return this.#gql.performQueryWithParser(
      queries.CALLS_FOR_VOTE('query'),
      { vote, first, skip },
      (result: QueryResult) => parseCalls(result)
    )
  }

  onCallsForVote(
    vote: string,
    first: number,
    skip: number,
    callback: SubscriptionCallback<Call[]>
  ): SubscriptionHandler {
    return this.#gql.subscribeToQueryWithParser<Call[]>(
      queries.CALLS_FOR_VOTE('subscription'),
      { vote, first, skip },
      callback,
      (result: QueryResult) => parseCalls(result)
    )
  }
}
