import { Annotation, TransactionRequestData } from '../types'

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
