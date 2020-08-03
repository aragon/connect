import { connect } from '@aragon/connect'
import { Organization, Repo } from '@aragon/connect-core'
import ConnectorTheGraph from '../connector'
import { isAddress } from '../../../test-helpers'

const ORG_NAME = 'piedao.aragonid.eth'
const APP_ADDRESS = '0xbce807b35dee2fbe457e4588f1c799879446eb54'

const MAINNET_NETWORK = {
  chainId: 1,
  name: 'ethereum',
}

describe('when connecting to the mainnet subgraph', () => {
  let org: Organization

  beforeAll(async () => {
    org = await connect(ORG_NAME, 'thegraph', { network: MAINNET_NETWORK })
  })

  afterAll(async () => {
    await org.connection.orgConnector.disconnect?.()
  })

  describe('when querying the repository of an app', () => {
    let repo: Repo

    beforeAll(async () => {
      repo = await org.connection.orgConnector.repoForApp(org, APP_ADDRESS)
    })

    test('should have a valid address', () => {
      expect(isAddress(repo.address)).toBeTruthy()
    })

    test('should have a valid artifact', () => {
      expect(repo.artifact).toBeDefined()
    })

    test('should have a valid content uri', () => {
      expect(repo.contentUri).toBeDefined()
      expect(repo.contentUri!.length).toBeGreaterThan(0)
    })

    test('should have a valid manifest', () => {
      expect(repo.manifest).toBeDefined()
    })

    test('should have valid roles', () => {
      expect(repo.roles).toBeDefined()
      expect(repo.roles!.length).toBeGreaterThan(0)
    })

    test('should have a valid name', () => {
      expect(repo.name).toBeDefined()
      expect(repo.name!.length).toBeGreaterThan(0)
    })
  })
})
