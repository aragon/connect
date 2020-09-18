import { ReactNode } from 'react'
import {
  ConnectOptions,
  ConnectorDeclaration,
  Organization,
} from '@aragon/connect'

export type ConnectProps = {
  children: ReactNode
  connector: ConnectorDeclaration
  location: string
  options?: ConnectOptions
}
export type ContextValue = {
  org: Organization | null
  orgStatus: LoadingStatus
}
export type LoadingStatus = {
  error: Error | null
  loading: boolean
  retry: () => void
}
export type OrganizationHookResult = [
  Organization | null,
  { error: Error | null; loading: boolean; retry: () => void }
]
