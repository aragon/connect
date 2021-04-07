import type { Networkish } from '@1hive/connect-types'
import { IpfsResolver } from '@1hive/connect-core'
import {
  ConnectorJsonConfig,
  IOrganizationConnector,
} from '@1hive/connect-core'
import { ConnectorEthereumConfig } from '@1hive/connect-ethereum'
import { ConnectorTheGraphConfig } from '@1hive/connect-thegraph'

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
