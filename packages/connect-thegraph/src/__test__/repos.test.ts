import ConnectorTheGraph from '../connector'
import {
  Repository
} from '@aragon/connect-core'
import {
  isAddress
} from '../../../test-helpers'

const DAO_SUBGRAPH_URL = 'https://api.thegraph.com/subgraphs/name/aragon/aragon-mainnet'
const APP_ADDRESS = '0xbce807b35dee2fbe457e4588f1c799879446eb54'

describe('when connecting to the mainnet subgraph', () => {
  let connector: ConnectorTheGraph

  beforeAll(() => {
    connector = new ConnectorTheGraph({
      daoSubgraphUrl: DAO_SUBGRAPH_URL
    })
  })

  describe('when querying the repository of an app', () => {
    let repo: Repository

    beforeAll(async () => {
      repo = await connector.repoForApp(APP_ADDRESS)
    })

    test('should have a valid address', () => {
      expect(isAddress(repo.address)).toBeTruthy()
    })

    test('should have a valid author', () => {
      expect(repo.author).toBeDefined()
      expect(repo.author!.length).toBeGreaterThan(0)
    })

    test('should have valid roles', () => {
      expect(repo.roles).toBeDefined()
      expect(repo.roles!.length).toBeGreaterThan(0)
    })

    test('should have valid environments', () => {
      expect(repo.environments).toBeDefined()

      const environments = Object.keys(repo.environments!)
      expect(environments.length).toBeGreaterThan(0)
    })

    test('should have a valid description', () => {
      expect(repo.description).toBeDefined()
      expect(repo.description!.length).toBeGreaterThan(0)
    })

    test('should have a valid description url', () => {
      expect(repo.descriptionUrl).toBeDefined()
      expect(repo.descriptionUrl!.length).toBeGreaterThan(0)
    })

    test('should have a valid name', () => {
      expect(repo.name).toBeDefined()
      expect(repo.name!.length).toBeGreaterThan(0)
    })

    test('should have a valid source url', () => {
      expect(repo.sourceUrl).toBeDefined()
      expect(repo.sourceUrl!.length).toBeGreaterThan(0)
    })
  })
})

