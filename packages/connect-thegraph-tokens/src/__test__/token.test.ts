import { TokenManagerConnectorTheGraph, Token } from '../../src'

const TOKENS_SUBGRAPH_URL = 'https://api.thegraph.com/subgraphs/name/aragon/aragon-tokens-rinkeby'
const TOKENS_APP_ADDRESS = '0xb5146c785a64fefc17bcbae1f07ad0000e300442'

describe('when connecting to a token manager app', () => {
  let connector: TokenManagerConnectorTheGraph

  beforeAll(() => {
    connector = new TokenManagerConnectorTheGraph(
      TOKENS_SUBGRAPH_URL
    )
  })

  describe('when querying for the token', () => {
    let token: Token

    beforeAll(async () => {
      token = await connector.token(
        TOKENS_APP_ADDRESS
      )
    })

    test('returns a token', () => {
      expect(token.id.length).toBeGreaterThan(0)
    })

    test('has the expected address', () => {
      expect(token.address).toBe('0x4445bcd1f3e18bafca435379c46a11f40461e2ef')
    })

    test('has the expected name', () => {
      expect(token.name).toBe('AleCoin')
    })

    test('has the expected symbol', () => {
      expect(token.symbol).toBe('ALE')
    })

    test('has the correct totalSupply', () => {
      expect(token.totalSupply).toBe('3000000000000000000')
    })

    test('is transferable', () => {
      expect(token.transferable).toBe(true)
    })
  })
})

