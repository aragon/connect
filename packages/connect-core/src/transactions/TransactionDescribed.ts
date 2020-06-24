import { TransactionRequestData } from './TransactionRequest'

export interface TransactionDescribedData extends TransactionRequestData {
  description?: string
  annotatedDescription?: Annotation[]
}

interface Annotation {
  type: string
  value: any
}

export default class TransactionDescribed implements TransactionDescribedData {
  readonly annotatedDescription?: Annotation[]
  readonly data!: string
  readonly description?: string
  readonly from!: string
  readonly to!: string

  constructor(data: TransactionDescribedData) {
    this.annotatedDescription = data.annotatedDescription
    this.description = data.description
    this.data = data.data
    this.from = data.from
    this.to = data.to
  }
}
