import {
  Address,
  SubscriptionCallback,
  SubscriptionHandler,
} from '@aragon/connect-types'
import { ErrorException } from '@aragon/connect-core'
import { GraphQLWrapper, QueryResult } from '@aragon/connect-thegraph'

import * as queries from './queries'
import Signer from '../models/Signer'
import Signature from '../models/Signature'
import Action from '../models/Action'
import Staking from '../models/Staking'
import StakingMovement from '../models/StakingMovement'
import Version from '../models/Version'
import DisputableApp from '../models/DisputableApp'
import CollateralRequirement from '../models/CollateralRequirement'
import ERC20 from '../models/ERC20'
import { AgreementData, IAgreementConnector } from '../types'
import {
  parseAgreement,
  parseSigner,
  parseSignatures,
  parseCurrentVersion,
  parseVersions,
  parseVersion,
  parseDisputableApps,
  parseCollateralRequirement,
  parseAction,
  parseStaking,
  parseStakingMovements,
  parseERC20,
} from './parsers'

export function subgraphUrlFromChainId(chainId: number) {
  if (chainId === 1) {
    return 'https://api.thegraph.com/subgraphs/name/aragon/aragon-agreement-mainnet'
  }
  if (chainId === 4) {
    return 'https://api.thegraph.com/subgraphs/name/aragon/aragon-agreement-rinkeby'
  }
  if (chainId === 100) {
    return 'https://api.thegraph.com/subgraphs/name/aragon/aragon-agreement-xdai'
  }
  return null
}

type AgreementConnectorTheGraphConfig = {
  appAddress?: Address
  pollInterval?: number
  subgraphUrl?: string
  verbose?: boolean
}

export default class AgreementConnectorTheGraph implements IAgreementConnector {
  #gql: GraphQLWrapper

  constructor(gql: GraphQLWrapper) {
    this.#gql = gql
  }

  static async create(
    config: AgreementConnectorTheGraphConfig
  ): Promise<AgreementConnectorTheGraph> {
    if (!config.subgraphUrl) {
      throw new ErrorException(
        'AgreementConnectorTheGraph requires subgraphUrl to be passed.'
      )
    }

    if (!config.appAddress) {
      throw new ErrorException(
        'AgreementConnectorTheGraph requires appAddress to be passed.'
      )
    }

    const gql = new GraphQLWrapper(config.subgraphUrl, {
      pollInterval: config.pollInterval,
      verbose: config.verbose,
    })

    return new AgreementConnectorTheGraph(gql)
  }

  async disconnect() {
    this.#gql.close()
  }

  async agreement(agreement: string): Promise<AgreementData> {
    return this.#gql.performQueryWithParser<AgreementData>(
      queries.GET_AGREEMENT('query'),
      { agreement },
      (result: QueryResult) => parseAgreement(result)
    )
  }

  onAgreement(
    agreement: string,
    callback: SubscriptionCallback<AgreementData>
  ): SubscriptionHandler {
    return this.#gql.subscribeToQueryWithParser<AgreementData>(
      queries.GET_AGREEMENT('subscription'),
      { agreement },
      callback,
      (result: QueryResult) => parseAgreement(result)
    )
  }

  async currentVersion(agreement: string): Promise<Version> {
    return this.#gql.performQueryWithParser<Version>(
      queries.GET_CURRENT_VERSION('query'),
      { agreement },
      (result: QueryResult) => parseCurrentVersion(result, this)
    )
  }

  onCurrentVersion(
    agreement: string,
    callback: SubscriptionCallback<Version>
  ): SubscriptionHandler {
    return this.#gql.subscribeToQueryWithParser<Version>(
      queries.GET_CURRENT_VERSION('subscription'),
      { agreement },
      callback,
      (result: QueryResult) => parseCurrentVersion(result, this)
    )
  }

  async version(versionId: string): Promise<Version> {
    return this.#gql.performQueryWithParser<Version>(
      queries.GET_VERSION('query'),
      { versionId },
      (result: QueryResult) => parseVersion(result, this)
    )
  }

  onVersion(
    versionId: string,
    callback: SubscriptionCallback<Version>
  ): SubscriptionHandler {
    return this.#gql.subscribeToQueryWithParser<Version>(
      queries.GET_VERSION('subscription'),
      { versionId },
      callback,
      (result: QueryResult) => parseVersion(result, this)
    )
  }

  async versions(
    agreement: string,
    first: number,
    skip: number
  ): Promise<Version[]> {
    return this.#gql.performQueryWithParser<Version[]>(
      queries.ALL_VERSIONS('query'),
      { agreement, first, skip },
      (result: QueryResult) => parseVersions(result, this)
    )
  }

  onVersions(
    agreement: string,
    first: number,
    skip: number,
    callback: SubscriptionCallback<Version[]>
  ): SubscriptionHandler {
    return this.#gql.subscribeToQueryWithParser<Version[]>(
      queries.ALL_VERSIONS('subscription'),
      { agreement, first, skip },
      callback,
      (result: QueryResult) => parseVersions(result, this)
    )
  }

  async disputableApps(
    agreement: string,
    first: number,
    skip: number
  ): Promise<DisputableApp[]> {
    return this.#gql.performQueryWithParser<DisputableApp[]>(
      queries.ALL_DISPUTABLE_APPS('query'),
      { agreement, first, skip },
      (result: QueryResult) => parseDisputableApps(result, this)
    )
  }

  onDisputableApps(
    agreement: string,
    first: number,
    skip: number,
    callback: SubscriptionCallback<DisputableApp[]>
  ): SubscriptionHandler {
    return this.#gql.subscribeToQueryWithParser<DisputableApp[]>(
      queries.ALL_DISPUTABLE_APPS('subscription'),
      { agreement, first, skip },
      callback,
      (result: QueryResult) => parseDisputableApps(result, this)
    )
  }

  async signer(signerId: string): Promise<Signer | null> {
    return this.#gql.performQueryWithParser<Signer | null>(
      queries.GET_SIGNER('query'),
      { signerId },
      (result: QueryResult) => parseSigner(result, this)
    )
  }

  onSigner(
    signerId: string,
    callback: SubscriptionCallback<Signer | null>
  ): SubscriptionHandler {
    return this.#gql.subscribeToQueryWithParser<Signer | null>(
      queries.GET_SIGNER('query'),
      { signerId },
      callback,
      (result: QueryResult) => parseSigner(result, this)
    )
  }

  async signatures(
    signerId: string,
    first: number,
    skip: number
  ): Promise<Signature[]> {
    return this.#gql.performQueryWithParser<Signature[]>(
      queries.GET_SIGNATURES('query'),
      { signerId, first, skip },
      (result: QueryResult) => parseSignatures(result, this)
    )
  }

  onSignatures(
    signerId: string,
    first: number,
    skip: number,
    callback: SubscriptionCallback<Signature[]>
  ): SubscriptionHandler {
    return this.#gql.subscribeToQueryWithParser<Signature[]>(
      queries.GET_SIGNATURES('query'),
      { signerId, first, skip },
      callback,
      (result: QueryResult) => parseSignatures(result, this)
    )
  }

  async collateralRequirement(
    collateralRequirementId: string
  ): Promise<CollateralRequirement> {
    return this.#gql.performQueryWithParser<CollateralRequirement>(
      queries.GET_COLLATERAL_REQUIREMENT('query'),
      { collateralRequirementId },
      (result: QueryResult) => parseCollateralRequirement(result, this)
    )
  }

  onCollateralRequirement(
    collateralRequirementId: string,
    callback: SubscriptionCallback<CollateralRequirement>
  ): SubscriptionHandler {
    return this.#gql.subscribeToQueryWithParser<CollateralRequirement>(
      queries.GET_COLLATERAL_REQUIREMENT('subscription'),
      { collateralRequirementId },
      callback,
      (result: QueryResult) => parseCollateralRequirement(result, this)
    )
  }

  async staking(
    stakingId: string
  ): Promise<Staking | null> {
    return this.#gql.performQueryWithParser<Staking>(
      queries.GET_STAKING('query'),
      { stakingId },
      (result: QueryResult) => parseStaking(result, this)
    )
  }

  onStaking(
    stakingId: string,
    callback: SubscriptionCallback<Staking | null>
  ): SubscriptionHandler {
    return this.#gql.subscribeToQueryWithParser<Staking | null>(
      queries.GET_STAKING('query'),
      { stakingId },
      callback,
      (result: QueryResult) => parseStaking(result, this)
    )
  }

  async stakingMovements(
    stakingId: string,
    agreementId: string,
    first: number,
    skip: number
  ): Promise<StakingMovement[]> {
    return this.#gql.performQueryWithParser<StakingMovement[]>(
      queries.GET_STAKING_MOVEMENTS('query'),
      { stakingId, agreementId, first, skip },
      (result: QueryResult) => parseStakingMovements(result, this)
    )
  }

  onStakingMovements(
    stakingId: string,
    agreementId: string,
    first: number,
    skip: number,
    callback: SubscriptionCallback<StakingMovement[]>
  ): SubscriptionHandler {
    return this.#gql.subscribeToQueryWithParser<StakingMovement[]>(
      queries.GET_STAKING_MOVEMENTS('query'),
      { stakingId, agreementId, first, skip },
      callback,
      (result: QueryResult) => parseStakingMovements(result, this)
    )
  }

  async action(actionId: string): Promise<Action | null> {
    return this.#gql.performQueryWithParser<Action | null>(
      queries.GET_ACTION('query'),
      { actionId },
      (result: QueryResult) => parseAction(result, this)
    )
  }

  onAction(
    actionId: string,
    callback: SubscriptionCallback<Action | null>
  ): SubscriptionHandler {
    return this.#gql.subscribeToQueryWithParser<Action | null>(
      queries.GET_ACTION('query'),
      { actionId },
      callback,
      (result: QueryResult) => parseAction(result, this)
    )
  }

  async ERC20(tokenAddress: Address): Promise<ERC20> {
    return this.#gql.performQueryWithParser<ERC20>(
      queries.GET_ERC20('query'),
      { tokenAddress },
      (result: QueryResult) => parseERC20(result)
    )
  }

  onERC20(
    tokenAddress: Address,
    callback: SubscriptionCallback<ERC20>
  ): SubscriptionHandler {
    return this.#gql.subscribeToQueryWithParser<ERC20>(
      queries.GET_ERC20('subscription'),
      { tokenAddress },
      callback,
      (result: QueryResult) => parseERC20(result)
    )
  }
}
