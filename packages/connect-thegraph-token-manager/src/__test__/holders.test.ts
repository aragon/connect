import { TokenManagerConnectorTheGraph, Token, TokenHolder } from '../../src'

const TOKENS_SUBGRAPH_URL = 'https://api.thegraph.com/subgraphs/name/aragon/aragon-tokens-rinkeby'
const TOKEN_ADDRESS = '0x4445bcd1f3e18bafca435379c46a11f40461e2ef'

describe('when connecting to a token manager app', () => {
  let connector: TokenManagerConnectorTheGraph

  beforeAll(() => {
    connector = new TokenManagerConnectorTheGraph(
      TOKENS_SUBGRAPH_URL
    )
  })

  describe('when querying for the holders of a token', () => {
    let holders: TokenHolder[]

    beforeAll(async () => {
      holders = await connector.tokenHolders(
        TOKEN_ADDRESS,
        1000,
        0
      )
    })

    test('reports 3 holders', () => {
      expect(holders.length).toBe(3)
    })

    describe('when looking at the first holder', () => {
      let holder: TokenHolder

      beforeAll(() => {
        holder = holders[0]
      })

      test('has the correct address', () => {
        expect(holder.address).toBe('0x23565f4f4cb3154fdc0b59a7382b7fee09ec9493')
      })

      // TODO: Skipped because subgraph is currently reporting twice this value.
      // Syncing a new version.
      test.skip('has the correct balance', () => {
        expect(holder.balance).toBe('1000000000000000000')
      })
    })
  })
})

