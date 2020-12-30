import { connect, App } from '@aragon/connect'
import { Organization } from '@aragon/connect-core'
import connectTokens, { Token, Tokens } from '../../src'

const ORG_NAME = '0x059bcfbc477c46ab39d76c05b7b40f3a42e7de3b'
const APP_ADDRESS = '0xB5146c785A64feFC17bCbAE1f07ad0000E300442'
const TOKEN_ADDRESS = '0x4445bcd1f3e18bafca435379c46a11f40461e2ef'

describe('when connecting to a token manager app', () => {
  let org: Organization
  let tokens: Tokens

  beforeAll(async () => {
    org = await connect(ORG_NAME, 'thegraph', { network: 4 })
    tokens = (await connectTokens(org.app(APP_ADDRESS))) as Tokens
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
