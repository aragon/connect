import { EvmScriptData } from '../types'

export default class EvmScript {
  readonly id: string
  readonly vote: string
  readonly contract: string
  readonly calldataLength: string
  readonly calldata: string

  constructor(data: EvmScriptData) {
    this.id = data.id
    this.vote = data.vote
    this.contract = data.contract
    this.calldataLength = data.calldataLength
    this.calldata = data.calldata
  }
}
