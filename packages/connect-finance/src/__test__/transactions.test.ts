import { Transaction, FinanceConnectorTheGraph } from '..'

const FINANCE_SUBGRAPH_URL =
  'https://api.thegraph.com/subgraphs/name/aragon/aragon-finance-rinkeby'

const FINANCE_APP_ADDRESS = '0x00696c6ab99c1fd7aa69539c7abe50f9bf972934'

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
        expect(transaction.amount).toBe('878000000000000000000')
      })

      test('should have a date', () => {
        expect(transaction.date).toBe('1569335499')
      })

      test('should have an entity', () => {
        expect(transaction.entity).toBe(
          '0x39a4d265db942361d92e2b0039cae73ea72a2ff9'
        )
      })

      test('should be incoming', () => {
        expect(transaction.isIncoming).toBeTruthy()
      })

      test('should have a reference', () => {
        expect(transaction.reference).toEqual('Requested airdrop (test tokens)')
      })

      test('should have a token address', () => {
        expect(transaction.token).toEqual(
          '0x5b2fdbba47e8ae35b9d6f8e1480703334f48b96c'
        )
      })
    })
  })
})
