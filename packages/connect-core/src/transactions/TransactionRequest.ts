export interface TransactionRequestData {
  to: string
  from: string
  data: string
  pretransaction?: {
    to: string
    from: string
    data: string
  }
  gas?: string
  gasPrice?: string
  gasLimit?: string
  chainId?: number
}

export default class TransactionRequest {
  readonly to!: string
  readonly from!: string
  readonly data!: string
  readonly pretransaction?: {
    to: string
    from: string
    data: string
  }
  readonly gas?: string
  readonly gasPrice?: string
  readonly gasLimit?: string
  readonly chainId?: number

  constructor(data: TransactionRequestData) {
    Object.assign(this, data)
  }
}
