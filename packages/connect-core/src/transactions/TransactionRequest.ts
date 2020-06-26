export interface TransactionRequestData {
  annotatedDescription?: Annotation[]
  description?: string
  data: string
  from: string
  to: string
}

export interface Annotation {
  type: string
  value: any
}

export default class TransactionRequest {
  readonly annotatedDescription?: Annotation[]
  readonly description?: string
  readonly data!: string
  readonly from!: string
  readonly to!: string

  constructor(data: TransactionRequestData) {
    this.annotatedDescription = data.annotatedDescription
    this.description = data.description
    this.data = data.data
    this.from = data.from
    this.to = data.to
  }
}
