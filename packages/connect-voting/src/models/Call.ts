import { CallData } from '../types'

export default class Call {
  readonly id: string
  readonly vote: string
  readonly contract: string
  readonly calldata: string

  constructor(data: CallData) {
    this.id = data.id
    this.vote = data.vote.id
    this.contract = data.contract
    this.calldata = data.calldata
  }
}
