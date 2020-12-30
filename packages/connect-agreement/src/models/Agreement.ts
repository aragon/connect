import { Contract, utils } from 'ethers'
import { SubscriptionCallback, SubscriptionResult } from '@aragon/connect-types'
import { subscription, App, ForwardingPath, arbitratorAbi } from '@aragon/connect-core'

import { bn } from '../helpers'
import Action from './Action'
import Signer from './Signer'
import Version from './Version'
import DisputableApp from './DisputableApp'
import Staking from './Staking'
import StakingMovement from './StakingMovement'
import { IAgreementConnector } from '../types'

export default class Agreement {
  #app: App
  #connector: IAgreementConnector

  readonly address: string

  constructor(connector: IAgreementConnector, app: App) {
    this.#connector = connector
    this.#app = app
    this.address = app.address
  }

  async disconnect() {
    await this.#connector.disconnect()
  }

  async id(): Promise<string> {
    const data = await this.#connector.agreement(this.address)
    return data.id
  }

  async dao(): Promise<string> {
    const data = await this.#connector.agreement(this.address)
    return data.dao
  }

  async stakingFactory(): Promise<string> {
    const data = await this.#connector.agreement(this.address)
    return data.stakingFactory
  }

  async currentVersion(): Promise<Version> {
    return this.#connector.currentVersion(this.address)
  }

  onCurrentVersion(
    callback?: SubscriptionCallback<Version>
  ): SubscriptionResult<Version> {
    return subscription<Version>(callback, (callback) =>
      this.#connector.onCurrentVersion(this.address, callback)
    )
  }

  versionId(versionNumber: string): string {
    return `${this.address}-version-${versionNumber}`
  }

  async version(versionNumber: string): Promise<Version> {
    return this.#connector.version(this.versionId(versionNumber))
  }

  onVersion(
    versionNumber: string,
    callback?: SubscriptionCallback<Version>
  ): SubscriptionResult<Version> {
    return subscription<Version>(callback, (callback) =>
      this.#connector.onVersion(this.versionId(versionNumber), callback)
    )
  }

  async disputeFees(versionId: string): Promise<any> {
    const version = await this.#connector.version(versionId)
    const arbitrator = new Contract(version.arbitrator, arbitratorAbi, this.#app.provider)
    return arbitrator.getDisputeFees()
  }

  async versions({ first = 1000, skip = 0 } = {}): Promise<Version[]> {
    return this.#connector.versions(this.address, first, skip)
  }

  onVersions(
    { first = 1000, skip = 0 } = {},
    callback?: SubscriptionCallback<Version[]>
  ): SubscriptionResult<Version[]> {
    return subscription<Version[]>(callback, (callback) =>
      this.#connector.onVersions(this.address, first, skip, callback)
    )
  }

  async disputableApps({ first = 1000, skip = 0 } = {}): Promise<DisputableApp[]> {
    return this.#connector.disputableApps(this.address, first, skip)
  }

  onDisputableApps(
    { first = 1000, skip = 0 } = {},
    callback?: SubscriptionCallback<DisputableApp[]>
  ): SubscriptionResult<DisputableApp[]> {
    return subscription<DisputableApp[]>(callback, (callback) =>
      this.#connector.onDisputableApps(this.address, first, skip, callback)
    )
  }

  signerId(signerAddress: string): string {
    return `${this.address}-signer-${signerAddress.toLowerCase()}`
  }

  async signer(signerAddress: string): Promise<Signer | null> {
    return this.#connector.signer(this.signerId(signerAddress))
  }

  onSigner(
    signerAddress: string,
    callback?: SubscriptionCallback<Signer | null>
  ): SubscriptionResult<Signer | null> {
    return subscription<Signer | null>(callback, (callback) =>
      this.#connector.onSigner(this.signerId(signerAddress), callback)
    )
  }

  stakingId(tokenAddress: string, userAddress: string): string {
    return `${tokenAddress.toLowerCase()}-staking-${userAddress.toLowerCase()}`
  }

  async staking(tokenAddress: string, userAddress: string): Promise<Staking | null> {
    return this.#connector.staking(this.stakingId(tokenAddress, userAddress))
  }

  onStaking(
    tokenAddress: string,
    userAddress: string,
    callback?: SubscriptionCallback<Staking | null>
  ): SubscriptionResult<Staking | null> {
    return subscription<Staking | null>(callback, (callback) =>
      this.#connector.onStaking(this.stakingId(tokenAddress, userAddress), callback)
    )
  }

  async stakingMovements(
    tokenAddress: string,
    userAddress: string,
    { first = 1000, skip = 0 } = {},
  ): Promise<StakingMovement[]> {
    return this.#connector.stakingMovements(this.stakingId(tokenAddress, userAddress), this.address, first, skip)
  }

  onStakingMovements(
    tokenAddress: string,
    userAddress: string,
    { first = 1000, skip = 0 } = {},
    callback?: SubscriptionCallback<StakingMovement[]>
  ): SubscriptionResult<StakingMovement[]> {
    return subscription<StakingMovement[]>(callback, (callback) =>
      this.#connector.onStakingMovements(this.stakingId(tokenAddress, userAddress), this.address, first, skip, callback)
    )
  }

  actionId(actionNumber: string): string {
    return `${this.address.toLowerCase()}-action-${actionNumber}`
  }

  async action(actionNumber: string): Promise<Action> {
    const action = await this.tryAction(actionNumber)
    if (!action) {
      throw Error(`Could not find given action number ${actionNumber}`)
    }
    return action as Action
  }

  async tryAction(actionNumber: string): Promise<Action | null> {
    return this.#connector.action(this.actionId(actionNumber))
  }

  onAction(actionNumber: string, callback?: SubscriptionCallback<Action | null>): SubscriptionResult<Action | null> {
    return subscription<Action | null>(callback, (callback) =>
      this.#connector.onAction(this.actionId(actionNumber), callback)
    )
  }

  async sign(signerAddress: string, versionNumber?: string): Promise<ForwardingPath> {
    if (!versionNumber) {
      versionNumber = (await this.currentVersion()).versionId
    }
    return this.#app.intent('sign', [versionNumber], { actAs: signerAddress })
  }

  async challenge(actionNumber: string, settlementOffer: string, finishedEvidence: boolean, context: string, signerAddress: string): Promise<ForwardingPath> {
    const intent = await this.#app.intent('challengeAction', [actionNumber, settlementOffer, finishedEvidence, utils.toUtf8Bytes(context)], { actAs: signerAddress })

    const action = await this.action(actionNumber)
    const { feeToken, feeAmount } = await this.disputeFees(action.versionId)
    const { tokenId: collateralToken, challengeAmount } = await action.collateralRequirement()
    const challengeCollateral = bn(challengeAmount)

    // approve challenge collateral and dispute fees
    const preTransactions = []
    if (feeToken.toLowerCase() == collateralToken.toLowerCase()) {
      const approvalAmount = challengeCollateral.add(feeAmount)
      const approvePreTransactions = await intent.buildApprovePreTransactions({ address: feeToken, value: approvalAmount })
      preTransactions.push(...approvePreTransactions)
    } else {
      const feesPreTransactions = await intent.buildApprovePreTransactions({ address: feeToken, value: feeAmount })
      const collateralPreTransactions = await intent.buildApprovePreTransactions({ address: collateralToken, value: challengeCollateral })
      preTransactions.push(...feesPreTransactions, ...collateralPreTransactions)
    }

    intent.applyPreTransactions(preTransactions)
    return intent
  }

  async dispute(actionNumber: string, finishedEvidence: boolean, signerAddress: string): Promise<ForwardingPath> {
    const intent = await this.#app.intent('disputeAction', [actionNumber, finishedEvidence], { actAs: signerAddress })

    const action = await this.action(actionNumber)
    const { feeToken, feeAmount } = await this.disputeFees(action.versionId)

    // approve dispute fees
    const preTransactions = await intent.buildApprovePreTransactions({ address: feeToken, value: feeAmount })
    intent.applyPreTransactions(preTransactions)
    return intent
  }

  settle(actionNumber: string, signerAddress: string): Promise<ForwardingPath> {
    return this.#app.intent('settleAction', [actionNumber], { actAs: signerAddress })
  }

  close(actionNumber: string, signerAddress: string): Promise<ForwardingPath> {
    return this.#app.intent('closeAction', [actionNumber], { actAs: signerAddress })
  }
}
