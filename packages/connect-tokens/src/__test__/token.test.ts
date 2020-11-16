import { connect } from '@aragon/connect'
import { Organization } from '@aragon/connect-core'
import connectTokens, { Token, Tokens } from '../../src'

const ORG = '0x1882d9e76e500dec9ef152b86895fc8f719f4fd3'
const TOKEN_ADDRESS = '0x94fed500630d647deee446ceef2d3f418ee7f095'

describe('when connecting to a token manager app', () => {
  let org: Organization
  let tokens: Tokens

  beforeAll(async () => {
    org = await connect(ORG, 'thegraph', { network: 4 })
    const token = await org.app('token-manager')
    tokens = await connectTokens(token)
  })

  afterAll(async () => {
    await org.connection.orgConnector.disconnect?.()
    await tokens.disconnect?.()
  })

  describe('when querying for the token', () => {
    let token: Token

    beforeAll(async () => {
      token = await tokens.token()
    })

    test('returns a token', () => {
      expect(token.id.length).toBeGreaterThan(0)
    })

    test('has the expected address', () => {
      expect(token.address).toBe(TOKEN_ADDRESS)
    })

    test('has the expected name', () => {
      expect(token.name).toBe('VINE TOKEN')
    })

    test('has the expected symbol', () => {
      expect(token.symbol).toBe('VINE')
    })

    test('has the correct totalSupply', () => {
      expect(token.totalSupply).toBe('1000000000000000000')
    })

    test('is transferable', () => {
      expect(token.transferable).toBe(true)
    })
  })
})
