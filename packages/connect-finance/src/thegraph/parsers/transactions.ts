import { QueryResult } from '@aragon/connect-thegraph'
import Transaction from '../../models/Transaction'
import { TransactionData } from '../../types'

export function parseTransactions(result: QueryResult): Transaction[] {
  const transactions = result.data.transactions

  if (!transactions) {
    throw new Error('Unable to parse transactions.')
  }

  const datas = transactions.map(
    (tx: any): TransactionData => {
      return tx
    }
  )

  return datas.map((data: TransactionData) => {
    return new Transaction(data)
  })
}
