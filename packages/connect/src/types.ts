import { Networkish } from '@aragon/connect-types'
import { IpfsResolver } from '@aragon/connect-core'
import {
  ConnectorJsonConfig,
  IOrganizationConnector,
} from '@aragon/connect-core'
import { ConnectorEthereumConfig } from '@aragon/connect-ethereum'
import { ConnectorTheGraphConfig } from '@aragon/connect-thegraph'

export type IpfsResolverDeclarationObject = {
  urlTemplate?: string
  cache?: number
}

export type IpfsResolverDeclaration =
  | IpfsResolver
  | IpfsResolverDeclarationObject
  | string

export type ConnectOptions = {
  actAs?: string
  ethereum?: object
  ipfs?: IpfsResolverDeclaration
  network?: Networkish
  verbose?: boolean
}

export type ConnectorDeclaration =
  | IOrganizationConnector
  | ['ethereum', ConnectorEthereumConfig | undefined]
  | ['json', ConnectorJsonConfig | undefined]
  | ['thegraph', ConnectorTheGraphConfig | undefined]
  | [string, any]
  | string
