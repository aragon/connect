import { Networkish } from '@aragon/connect-types'
import { IpfsResolver } from '@aragon/connect-core'
import {
  ConnectorJsonConfig,
  IOrganizationConnector,
} from '@aragon/connect-core'
import { ConnectorEthereumConfig } from '@aragon/connect-ethereum'
import { ConnectorTheGraphConfig } from '@aragon/connect-thegraph'

export type ConnectOptions = {
  actAs?: string
  ethereum?: object
  ipfs?: IpfsResolver | string
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
