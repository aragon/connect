import { RewardData } from '../types'

export default class Reward {
  readonly id: string
  readonly vote: string
  readonly token: string
  readonly to: string
  readonly amount: string

  constructor(data: RewardData) {
    this.id = data.id
    this.vote = data.vote.id
    this.token = data.token
    this.to = data.to
    this.amount = data.amount
  }
}
