import { SubscriptionHandler } from '@aragon/connect-types'
import { GraphQLWrapper, QueryResult } from '@aragon/connect-thegraph'

import { DisputableVotingData, IDisputableVotingConnector } from '../types'
import Vote from '../models/Vote'
import Voter from '../models/Voter'
import Setting from '../models/Setting'
import CastVote from '../models/CastVote'
import CollateralRequirement from '../models/CollateralRequirement'
import * as queries from './queries'
import {
  parseSetting,
  parseSettings,
  parseCurrentSetting,
  parseDisputableVoting,
  parseVoter,
  parseVote,
  parseVotes,
  parseCastVote,
  parseCastVotes,
  parseCollateralRequirement,
} from './parsers'

export function subgraphUrlFromChainId(chainId: number) {
  if (chainId === 1) {
    return 'https://api.thegraph.com/subgraphs/name/aragon/aragon-dvoting-mainnet'
  }
  if (chainId === 4) {
    return 'https://api.thegraph.com/subgraphs/name/aragon/aragon-dvoting-rinkeby'
  }
  if (chainId === 100) {
    return 'https://api.thegraph.com/subgraphs/name/aragon/aragon-dvoting-xdai'
  }
  return null
}

type DisputableVotingConnectorTheGraphConfig = {
  pollInterval?: number
  subgraphUrl?: string
  verbose?: boolean
}

export default class DisputableVotingConnectorTheGraph
  implements IDisputableVotingConnector {
  #gql: GraphQLWrapper

  constructor(config: DisputableVotingConnectorTheGraphConfig) {
    if (!config.subgraphUrl) {
      throw new Error(
        'DisputableVotingConnectorTheGraph requires subgraphUrl to be passed.'
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

  async disputableVoting(
    disputableVoting: string
  ): Promise<DisputableVotingData> {
    return this.#gql.performQueryWithParser(
      queries.GET_DISPUTABLE_VOTING('query'),
      { disputableVoting },
      (result: QueryResult) => parseDisputableVoting(result)
    )
  }

  onDisputableVoting(
    disputableVoting: string,
    callback: Function
  ): SubscriptionHandler {
    return this.#gql.subscribeToQueryWithParser(
      queries.GET_DISPUTABLE_VOTING('subscription'),
      { disputableVoting },
      callback,
      (result: QueryResult) => parseDisputableVoting(result)
    )
  }

  async currentSetting(disputableVoting: string): Promise<Setting> {
    return this.#gql.performQueryWithParser(
      queries.GET_CURRENT_SETTING('query'),
      { disputableVoting },
      (result: QueryResult) => parseCurrentSetting(result, this)
    )
  }

  onCurrentSetting(
    disputableVoting: string,
    callback: Function
  ): SubscriptionHandler {
    return this.#gql.subscribeToQueryWithParser(
      queries.GET_CURRENT_SETTING('subscription'),
      { disputableVoting },
      callback,
      (result: QueryResult) => parseCurrentSetting(result, this)
    )
  }

  async setting(settingId: string): Promise<Setting> {
    return this.#gql.performQueryWithParser(
      queries.GET_SETTING('query'),
      { settingId },
      (result: QueryResult) => parseSetting(result, this)
    )
  }

  onSetting(settingId: string, callback: Function): SubscriptionHandler {
    return this.#gql.subscribeToQueryWithParser(
      queries.GET_SETTING('subscription'),
      { settingId },
      callback,
      (result: QueryResult) => parseSetting(result, this)
    )
  }

  async settings(
    disputableVoting: string,
    first: number,
    skip: number
  ): Promise<Setting[]> {
    return this.#gql.performQueryWithParser(
      queries.ALL_SETTINGS('query'),
      { disputableVoting, first, skip },
      (result: QueryResult) => parseSettings(result, this)
    )
  }

  onSettings(
    disputableVoting: string,
    first: number,
    skip: number,
    callback: Function
  ): SubscriptionHandler {
    return this.#gql.subscribeToQueryWithParser(
      queries.ALL_SETTINGS('subscription'),
      { disputableVoting, first, skip },
      callback,
      (result: QueryResult) => parseSettings(result, this)
    )
  }

  async vote(voteId: string): Promise<Vote> {
    return this.#gql.performQueryWithParser(
      queries.GET_VOTE('query'),
      { voteId },
      (result: QueryResult) => parseVote(result, this)
    )
  }

  onVote(voteId: string, callback: Function): SubscriptionHandler {
    return this.#gql.subscribeToQueryWithParser(
      queries.GET_VOTE('subscription'),
      { voteId },
      callback,
      (result: QueryResult) => parseVote(result, this)
    )
  }

  async votes(
    disputableVoting: string,
    first: number,
    skip: number
  ): Promise<Vote[]> {
    return this.#gql.performQueryWithParser(
      queries.ALL_VOTES('query'),
      { disputableVoting, first, skip },
      (result: QueryResult) => parseVotes(result, this)
    )
  }

  onVotes(
    disputableVoting: string,
    first: number,
    skip: number,
    callback: Function
  ): SubscriptionHandler {
    return this.#gql.subscribeToQueryWithParser(
      queries.ALL_VOTES('subscription'),
      { disputableVoting, first, skip },
      callback,
      (result: QueryResult) => parseVotes(result, this)
    )
  }

  async castVote(castVoteId: string): Promise<CastVote | null> {
    return this.#gql.performQueryWithParser(
      queries.GET_CAST_VOTE('query'),
      { castVoteId },
      (result: QueryResult) => parseCastVote(result, this)
    )
  }

  onCastVote(castVoteId: string, callback: Function): SubscriptionHandler {
    return this.#gql.subscribeToQueryWithParser(
      queries.GET_CAST_VOTE('subscription'),
      { castVoteId },
      callback,
      (result: QueryResult) => parseCastVote(result, this)
    )
  }

  async castVotes(
    voteId: string,
    first: number,
    skip: number
  ): Promise<CastVote[]> {
    return this.#gql.performQueryWithParser(
      queries.ALL_CAST_VOTES('query'),
      { voteId, first, skip },
      (result: QueryResult) => parseCastVotes(result, this)
    )
  }

  onCastVotes(
    voteId: string,
    first: number,
    skip: number,
    callback: Function
  ): SubscriptionHandler {
    return this.#gql.subscribeToQueryWithParser(
      queries.ALL_CAST_VOTES('subscription'),
      { voteId, first, skip },
      callback,
      (result: QueryResult) => parseCastVotes(result, this)
    )
  }

  async voter(voterId: string): Promise<Voter> {
    return this.#gql.performQueryWithParser(
      queries.GET_VOTER('query'),
      { voterId },
      (result: QueryResult) => parseVoter(result, this)
    )
  }

  onVoter(voterId: string, callback: Function): SubscriptionHandler {
    return this.#gql.subscribeToQueryWithParser(
      queries.GET_VOTER('subscription'),
      { voterId },
      callback,
      (result: QueryResult) => parseVoter(result, this)
    )
  }

  async collateralRequirement(voteId: string): Promise<CollateralRequirement> {
    return this.#gql.performQueryWithParser(
      queries.GET_COLLATERAL_REQUIREMENT('query'),
      { voteId },
      (result: QueryResult) => parseCollateralRequirement(result, this)
    )
  }

  onCollateralRequirement(
    voteId: string,
    callback: Function
  ): SubscriptionHandler {
    return this.#gql.subscribeToQueryWithParser(
      queries.GET_COLLATERAL_REQUIREMENT('subscription'),
      { voteId },
      callback,
      (result: QueryResult) => parseCollateralRequirement(result, this)
    )
  }
}
