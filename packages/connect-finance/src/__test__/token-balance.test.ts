import { TokenBalance, FinanceConnectorTheGraph } from '..'

const FINANCE_SUBGRAPH_URL =
  'https://api.thegraph.com/subgraphs/name/aragon/aragon-finance-goerli'

const FINANCE_APP_ADDRESS = '0x777803a933f26ed3f2a8897e08d0f29a7fdf40c9'

const TOKEN_ADDRESS = '0x0000000000000000000000000000000000000000'

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
        '0x0000000000000000000000000000000000000000'
      )
    })

    test('should have a balance', () => {
      expect(tokenBalance.balance).toBe('50000000000000000')
    })
  })
})
