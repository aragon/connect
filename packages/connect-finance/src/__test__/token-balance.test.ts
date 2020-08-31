import { TokenBalance, FinanceConnectorTheGraph } from '..'

const FINANCE_SUBGRAPH_URL =
  'https://api.thegraph.com/subgraphs/name/aragon/aragon-finance-rinkeby'

const FINANCE_APP_ADDRESS = '0x00696c6ab99c1fd7aa69539c7abe50f9bf972934'

const TOKEN_ADDRESS = '0x5b2fdbba47e8ae35b9d6f8e1480703334f48b96c'

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

  describe('when getting the balance for a token', () => {
    let tokenBalance: TokenBalance

    beforeAll(async () => {
      tokenBalance = await connector.balanceForToken(
        FINANCE_APP_ADDRESS,
        TOKEN_ADDRESS,
        1000,
        0
      )
    })

    test('should have a token address', () => {
      expect(tokenBalance.token).toBe(
        '0x5b2fdbba47e8ae35b9d6f8e1480703334f48b96c'
      )
    })

    test('should have a balance', () => {
      expect(tokenBalance.balance).toBe('876000000000000000000')
    })
  })
})
