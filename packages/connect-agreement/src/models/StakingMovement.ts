import { subscription } from '@aragon/connect-core'
import { SubscriptionCallback, SubscriptionResult } from '@aragon/connect-types'

import ERC20 from './ERC20'
import Action from '../models/Action'
import Staking from '../models/Staking'
import { formatBn } from '../helpers'
import { IAgreementConnector, StakingMovementData } from '../types'


export default class StakingMovement {
  #connector: IAgreementConnector

  readonly id: string
  readonly stakingId: string
  readonly agreementId: string
  readonly tokenId: string
  readonly tokenDecimals: string
  readonly amount: string
  readonly actionId: string
  readonly actionState: string
  readonly collateralState: string
  readonly createdAt: string

  constructor(data: StakingMovementData, connector: IAgreementConnector) {
    this.#connector = connector

    this.id = data.id
    this.stakingId = data.stakingId
    this.agreementId = data.agreementId
    this.tokenId = data.tokenId
    this.tokenDecimals = data.tokenDecimals
    this.amount = data.amount
    this.actionId = data.actionId
    this.actionState = data.actionState
    this.collateralState = data.collateralState
    this.createdAt = data.createdAt
  }

  async disconnect() {
    await this.#connector.disconnect()
  }

  get formattedAmount(): string {
    return formatBn(this.amount, this.tokenDecimals)
  }

  async token(): Promise<ERC20> {
    return this.#connector.ERC20(this.tokenId)
  }

  onToken(callback?: SubscriptionCallback<ERC20>): SubscriptionResult<ERC20> {
    return subscription<ERC20>(callback, (callback) =>
      this.#connector.onERC20(this.tokenId, callback)
    )
  }

  async staking(): Promise<Staking> {
    return this.#connector.staking(this.stakingId)
  }

  onStaking(callback?: SubscriptionCallback<Staking>): SubscriptionResult<Staking> {
    return subscription<Staking>(callback, (callback) =>
      this.#connector.onStaking(this.stakingId, callback)
    )
  }

  async action(): Promise<Action | null> {
    return this.#connector.action(this.actionId || '')
  }

  onAction(callback?: SubscriptionCallback<Action | null>): SubscriptionResult<Action | null> {
    return subscription<Action | null>(callback, (callback) =>
      this.#connector.onAction(this.actionId || '', callback)
    )
  }
}
