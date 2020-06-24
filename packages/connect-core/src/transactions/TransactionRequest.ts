export interface TransactionRequestData {
  data: string
  from: string
  to: string
}

export default class TransactionRequest {
  readonly data!: string
  readonly from!: string
  readonly to!: string

  constructor(data: TransactionRequestData) {
    this.data = data.data
    this.from = data.from
    this.to = data.to
  }
}
