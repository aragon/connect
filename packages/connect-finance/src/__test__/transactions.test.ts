import { Transaction, FinanceConnectorTheGraph } from '..'

const FINANCE_SUBGRAPH_URL =
  'https://api.thegraph.com/subgraphs/name/aragon/aragon-finance-goerli'

const FINANCE_APP_ADDRESS = '0x777803a933f26ed3f2a8897e08d0f29a7fdf40c9'

describe('when connecting to a finance app', () => {
  let connector: FinanceConnectorTheGraph

  beforeAll(() => {
    connector = new FinanceConnectorTheGraph({
      subgraphUrl: FINANCE_SUBGRAPH_URL,
    })
  })

  afterAll(async () => {
    await connector.disconnect()
  })

  describe('when getting the list of transactons for an app', () => {
    let transactions: Transaction[]

    beforeAll(async () => {
      transactions = await connector.transactionsForApp(
        FINANCE_APP_ADDRESS,
        1000,
        0
      )
    })

    test('returns a list of transactions', () => {
      expect(transactions.length).toBeGreaterThan(0)
    })

    describe('when looking at a single transaction', () => {
      let transaction: Transaction

      beforeAll(() => {
        transaction = transactions[0]
      })

      test('should have an amount', () => {
        expect(transaction.amount).toBe('100000000000000000')
      })

      test('should have a date', () => {
        expect(transaction.date).toBe('1666590816')
      })

      test('should have an entity', () => {
        expect(transaction.entity).toBe(
          '0x87c4554a0669efed8811c15d23a20a88d23ad735'
        )
      })

      test('should be incoming', () => {
        expect(transaction.isIncoming).toBeTruthy()
      })

      test('should have a reference', () => {
        expect(transaction.reference).toEqual('')
      })

      test('should have a token address', () => {
        expect(transaction.token).toEqual(
          '0x0000000000000000000000000000000000000000'
        )
      })
    })
  })
})
