import { providers as ethersProviders, utils as ethersUtils } from 'ethers'
import { Address, Network } from '@aragon/connect-types'
import IOrganizationConnector from './connections/IOrganizationConnector'

export type Metadata = (AragonArtifact | AragonManifest)[]

// Type definition: https://github.com/ethers-io/ethers.js/blob/ethers-v5-beta/packages/abi/lib/fragments.d.ts#L68
export type FunctionFragment = ethersUtils.FunctionFragment

export type Abi = (ethersUtils.EventFragment | ethersUtils.FunctionFragment)[]

export interface AppIntent {
  roles: string[]
  sig: string
  /**
   * This field might not be able if the contract does not use
   * conventional solidity syntax and Aragon naming standards
   * null if there in no notice
   */
  notice: string | null
  /**
   * The function's ABI element is included for convenience of the client
   * null if ABI is not found for this signature
   */
  abi: FunctionFragment | null
}

// The aragon manifest requires the use of camelcase for some names
/* eslint-disable camelcase */
export interface AragonManifest {
  name: string // 'Counter'
  author: string // 'Aragon Association'
  description: string // 'An app for Aragon'
  changelog_url: string // 'https://github.com/aragon/aragon-apps/releases',
  details_url: string // '/meta/details.md'
  source_url: string // 'https://<placeholder-repository-url>'
  icons: {
    src: string // '/meta/icon.svg'
    sizes: string // '56x56'
  }[]
  screenshots: {
    src: string // '/meta/screenshot-1.png'
  }[]
  script: string // '/script.js'
  start_url: string // '/index.html'
}

export interface AragonArtifactRole {
  name: string // 'Create new payments'
  id: string // 'CREATE_PAYMENTS_ROLE'
  params: string[] //  ['Token address', ... ]
  bytes: string // '0x5de467a460382d13defdc02aacddc9c7d6605d6d4e0b8bd2f70732cae8ea17bc'
}

export interface AragonArtifact extends AragonAppJson {
  roles: AragonArtifactRole[]
  abi: Abi
  /**
   * All publicly accessible functions
   * Includes metadata needed for radspec and transaction pathing
   * initialize() function should also be included for completeness
   */
  functions: AppIntent[]
  /**
   * Functions that are no longer available at `version`
   */
  deprecatedFunctions: {
    [version: string]: AppIntent[]
  }
  /**
   * The flaten source code of the contracts must be included in
   * any type of release at this path
   */
  flattenedCode: string // "./code.sol"
  appId: string
  appName: string

  // env: AragonEnvironment // DEPRECATED
  // deployment: any // DEPRECATED
  // path: string // DEPRECATED 'contracts/Finance.sol'
  // environments: AragonEnvironments // DEPRECATED
}

export interface AragonAppJson {
  roles: AragonArtifactRole[]
  environments: AragonEnvironments
  path: string
  dependencies?: {
    appName: string // 'vault.aragonpm.eth'
    version: string // '^4.0.0'
    initParam: string // '_vault'
    state: string // 'vault'
    requiredPermissions: {
      name: string // 'TRANSFER_ROLE'
      params: string // '*'
    }[]
  }[]
  /**
   * If the appName is different per network use environments
   * ```ts
   * environments: {
   *   rinkeby: {
   *     appName: "myapp.open.aragonpm.eth"
   *   }
   * }
   * ```
   */
  appName?: string
  env?: AragonEnvironment
}

export interface AragonEnvironments {
  [environmentName: string]: AragonEnvironment
}

export interface AragonEnvironment {
  network: string
  registry?: string
  appName?: string
  gasPrice?: string
  wsRPC?: string
  appId?: string
}

export type IpfsResolver = {
  url: (cid: string, path?: string) => Promise<string>
  json: (cid: string, path?: string) => Promise<object>
}

export type ConnectionContext = {
  actAs: Address | null
  ethereumProvider: object | null
  ethersProvider: ethersProviders.Provider
  ipfs: IpfsResolver
  network: Network
  orgAddress: Address
  orgConnector: IOrganizationConnector
  orgLocation: string
  verbose: boolean
}
