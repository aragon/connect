import { BigNumber, providers as ethersProviders, utils as ethersUtils } from 'ethers'
import { Address, Network } from '@aragon/connect-types'

import IOrganizationConnector from './connections/IOrganizationConnector'
import App from './entities/App'
import Transaction from './entities/Transaction'

export type Abi = (ethersUtils.EventFragment | ethersUtils.FunctionFragment)[]

export type ConnectionContext = {
  actAs: Address | null
  ethereumProvider: object | null
  ethersProvider: ethersProviders.Provider
  ipfs: (cid: string) => string
  network: Network
  orgAddress: Address
  orgConnector: IOrganizationConnector
  orgLocation: string
  verbose: boolean
}

export type AppOrAddress = App | Address

export type ForwardingPathDeclaration = AppOrAddress[]

export type PathOptions = {
  // The account to sign the transactions with. It is optional
  // when `actAs` has been set with the connection. If not,
  // the address has to be passed.
  actAs?: Address

  // Optionally declare a forwarding path. When not specified,
  // the shortest path is used instead.
  path?: ForwardingPathDeclaration
}

export interface CallScriptAction {
  to: string
  data: string
}

export interface Annotation {
  type: string
  value: any
}

export interface PostProcessDescription {
  description: string
  annotatedDescription?: Annotation[]
}

export interface StepDecoded {
  to: string
  data: string
  from?: string
  children?: StepDecoded[]
}

export interface StepDescribed extends StepDecoded {
  description: string
  annotatedDescription?: Annotation[]
}

export interface TransactionPath {
  path: Transaction[]
  transactions: Transaction[]
}

////// ENTITES /////

export interface AppData {
  address: string
  appId: string
  artifact?: string | null
  codeAddress: string
  contentUri?: string
  isForwarder?: boolean
  isUpgradeable?: boolean
  kernelAddress: string
  manifest?: string | null
  name?: string
  registry?: string
  registryAddress: string
  repoAddress?: string
  version?: string
}

export interface ForwardingPathData {
  destination: App
  path: Transaction[]
  transactions: Transaction[]
}

export interface ParamData {
  argumentId: number
  operationType: number
  argumentValue: BigInt
}

export interface PermissionData {
  allowed: boolean
  appAddress: string
  granteeAddress: string
  params: ParamData[]
  roleHash: string
}

export interface RepoData {
  address: string
  artifact?: string | null
  contentUri?: string
  lastVersion?: string
  manifest?: string | null
  name: string
  registry?: string
  registryAddress?: string
}

export interface RoleData {
  appAddress: string
  appId: string
  artifact?: string | null
  contentUri?: string | null
  hash: string
  manager?: string
  grantees?: PermissionData[] | null
}

export interface TransactionData {
  data: string
  from: Address
  to: Address
}

export interface TokenData {
  address: Address
  value: string | BigNumber
  spender?: Address
}

////// METADATA //////

export type Metadata = (AragonArtifact | AragonManifest)[]

export interface AppMethod {
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
  abi: ethersUtils.FunctionFragment | null
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
  functions: AppMethod[]
  /**
   * Functions that are no longer available at `version`
   */
  deprecatedFunctions: {
    [version: string]: AppMethod[]
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
