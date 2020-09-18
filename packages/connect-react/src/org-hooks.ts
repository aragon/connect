import { useCallback, useEffect, useRef, useState } from 'react'
import { AppFiltersParam, SubscriptionHandler } from '@aragon/connect-types'
import { App, Organization, Permission } from '@aragon/connect'
import { LoadingStatus, OrganizationHookResult } from './types'
import { useConnectContext } from './connect-context'

export function useSubscription<Data>(
  callback: (
    org: Organization,
    onData: (error: Error | null, data: Data) => void
  ) => SubscriptionHandler,
  initValue: Data
): [Data, LoadingStatus] {
  const [{ data, error, loading }, setStatus] = useState<{
    data: Data
    error: Error | null
    loading: boolean
  }>({
    data: initValue,
    error: null,
    loading: true,
  })

  const {
    org,
    orgStatus: { loading: orgLoading },
  } = useConnectContext()
  const cancelCb = useRef<Function | null>(null)
  const dataJsonRef = useRef<string>(JSON.stringify(initValue))

  // The init value never changes
  const initValueRef = useRef<Data>(initValue)

  const subscribe = useCallback(() => {
    if (!org) {
      // If the org is loading, the subscription is loading as well.
      setStatus({
        data: initValueRef.current,
        error: null,
        loading: orgLoading,
      })
      return
    }

    let cancelled = false
    let handler: any

    cancelCb.current?.()
    cancelCb.current = () => {
      console.log('CANCEL CB')
      cancelled = true
      handler?.unsubscribe?.()
    }

    setStatus((status) => ({ ...status, loading: true }))

    handler = callback(org, (error: Error | null, data: Data) => {
      if (cancelled) {
        return
      }

      // This is necessary because some connectors might keep providing new app
      // instances, even if these instances are not actually updated.
      // For example, the Graph connector uses HTTP polling which has this effect.
      const dataJson = JSON.stringify({ error, data })
      if (dataJson === dataJsonRef.current) {
        return
      }

      dataJsonRef.current = dataJson

      setStatus({
        error: error || null,
        data: error ? initValueRef.current : data,
        loading: false,
      })
    })
  }, [callback, initValueRef, org, orgLoading])

  useEffect(() => {
    subscribe()
  }, [subscribe])

  return [data, { error, loading, retry: subscribe }]
}

export function useOrganization(): OrganizationHookResult {
  const { org, orgStatus } = useConnectContext()
  return [org, orgStatus]
}

export function useApp(
  appsFilter?: AppFiltersParam
): [App | null, LoadingStatus] {
  const callback = useCallback((org, onData) => org.onApp(appsFilter, onData), [
    JSON.stringify(appsFilter),
  ])
  return useSubscription<App | null>(callback, null)
}

export function useApps(appsFilter?: AppFiltersParam): [App[], LoadingStatus] {
  const callback = useCallback(
    (org, onData) => org.onApps(appsFilter, onData),
    [JSON.stringify(appsFilter)]
  )
  return useSubscription<App[]>(callback, [])
}

export function usePermissions(): [Permission[], LoadingStatus] {
  const callback = useCallback((org, onData) => org.onPermissions(onData), [])
  return useSubscription<Permission[]>(callback, [])
}
