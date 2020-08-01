import { connect } from '@aragon/connect'
import { Organization } from '@aragon/connect-core'
import connectTokens, { Tokens, TokenHolder } from '../../src'

const ORG_NAME = '0x059bcfbc477c46ab39d76c05b7b40f3a42e7de3b'
const APP_ADDRESS = '0xB5146c785A64feFC17bCbAE1f07ad0000E300442'
const TOKEN_ADDRESS = '0x4445bcd1f3e18bafca435379c46a11f40461e2ef'

describe('when connecting to a token manager app', () => {
  let org: Organization
  let tokens: Tokens

  beforeAll(async () => {
    org = await connect(ORG_NAME, 'thegraph', { network: 4 })
    tokens = await connectTokens(org.app(APP_ADDRESS))
  })

  afterAll(async () => {
    await org.connection.orgConnector.disconnect?.()
    await tokens.disconnect()
  })

  describe('when querying for the holders of a token', () => {
    let holders: TokenHolder[]

    beforeAll(async () => {
      holders = await tokens.holders()
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
        expect(holder.address).toBe(
          '0x23565f4f4cb3154fdc0b59a7382b7fee09ec9493'
        )
      })

      test('has the correct balance', () => {
        expect(holder.balance).toBe('1000000000000000000')
      })
    })
  })
})
