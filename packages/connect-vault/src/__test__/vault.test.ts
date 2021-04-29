import { TokenBalance, VaultConnectorTheGraph } from '..'

const VAULT_APP_ADDRESS = '0xa53c911b7d95d1d1a5e8a62374227ff4f35d2d57'
const VAULT_SUBGRAPH_URL = 'https://api.thegraph.com/subgraphs/name/aragon/aragon-vault-rinkeby-staging'

describe('when connecting to a vault app', () => {
  let connector: VaultConnectorTheGraph

  beforeAll(() => {
    connector = new VaultConnectorTheGraph({ subgraphUrl: VAULT_SUBGRAPH_URL })
  })

  afterAll(async () => {
    await connector.disconnect()
  })

  describe('when getting the balance for a token', () => {
    let tokenBalances: TokenBalance[]

    beforeAll(async () => {
      tokenBalances = await connector.tokenBalances(VAULT_APP_ADDRESS, 1000, 0)
    })

    test('should have the expected balances', () => {
      expect(tokenBalances.length > 0).toBe(true)

      const tokenBalance = tokenBalances[0]
      expect(tokenBalance.balance).toBe('876000000000000000000')
      expect(tokenBalance.token.id).toBe('0x5b2fdbba47e8ae35b9d6f8e1480703334f48b96c')
      expect(tokenBalance.token.name).toBe('District0x')
      expect(tokenBalance.token.symbol).toBe('DNT')
      expect(tokenBalance.token.decimals).toBe(18)
    })
  })
})
