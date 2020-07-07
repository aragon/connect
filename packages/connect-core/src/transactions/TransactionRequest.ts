export interface TransactionRequestData {
  children?: TransactionRequest[]
  description?: string
  descriptionAnnotated?: Annotation[]
  data: string
  from?: string
  to: string
}

export interface Annotation {
  type: string
  value: any
}

export default class TransactionRequest {
  readonly children?: TransactionRequest[]
  readonly description?: string
  readonly descriptionAnnotated?: Annotation[]
  readonly data!: string
  readonly from?: string
  readonly to!: string

  constructor(data: TransactionRequestData) {
    this.children = data.children
    this.description = data.description
    this.descriptionAnnotated = data.descriptionAnnotated
    this.data = data.data
    this.from = data.from
    this.to = data.to
  }
}
