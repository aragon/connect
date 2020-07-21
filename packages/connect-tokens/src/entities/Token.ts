export type TokenData = {
  address: string
  id: string
  name: string
  symbol: string
  totalSupply: string
  transferable: boolean
}

export default class Token {
  readonly address: string
  readonly id: string
  readonly name: string
  readonly symbol: string
  readonly totalSupply: string
  readonly transferable: boolean

  constructor(data: TokenData) {
    this.address = data.address
    this.id = data.id
    this.name = data.name
    this.symbol = data.symbol
    this.totalSupply = data.totalSupply
    this.transferable = data.transferable
  }
}
