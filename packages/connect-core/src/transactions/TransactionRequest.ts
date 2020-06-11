export interface TransactionRequestData {
  to: string
  from: string
  data: string
  pretransaction?: {
    to: string
    from: string
    data: string
  }
  description?: string
  annotatedDescription?: Annotation[]
  chainId?: number
  gas?: string
  gasPrice?: string
  gasLimit?: string
}

export interface Annotation {
  type: string
  value: any
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
  readonly description?: string
  readonly annotatedDescription?: Annotation[]
  readonly gas?: string
  readonly gasPrice?: string
  readonly gasLimit?: string
  readonly chainId?: number

  constructor(data: TransactionRequestData) {
    Object.assign(this, data)
  }
}
