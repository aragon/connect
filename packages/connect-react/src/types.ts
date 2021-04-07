import { ReactNode } from 'react'
import type {
  ConnectOptions,
  ConnectorDeclaration,
  Organization,
} from '@1hive/connect'
import { SubscriptionResult, SubscriptionStart } from '@1hive/connect-types'

export type ConnectProps = {
  children: ReactNode
  connector: ConnectorDeclaration
  location: string
  options?: ConnectOptions
}
export type LoadingStatus = {
  error: Error | null
  loading: boolean
  retry: () => void
}
export type ContextValue = {
  org: Organization | null
  orgStatus: LoadingStatus
}

export type UseConnectResult<T> = [T | undefined, LoadingStatus]

export type UseConnectCallback<T> = (
  organization: Organization
) => T | Promise<T> | SubscriptionResult<T> | undefined

export function isSubscriptionStart<T>(
  value: unknown
): value is SubscriptionStart<T> {
  return typeof value === 'function'
}
