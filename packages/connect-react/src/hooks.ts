import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
  AppFiltersParam,
  SubscriptionHandler,
  SubscriptionResult,
} from '@aragon/connect-types'
import { App, Organization, Permission } from '@aragon/connect'
import { LoadingStatus, OrganizationHookResult } from './types'
import { useConnectContext } from './connect-context'

type AppDataState<T> = {
  error: Error | null
  loading: boolean
  result?: T
}

const appDataDefaultState = {
  error: null,
  loading: true,
  result: undefined,
}

export function useConnectData<T = any>(
  callback?: () => T | Promise<T> | SubscriptionResult<T>,
  dependencies?: any[]
): [T | undefined, LoadingStatus] {
  const [{ result, error, loading }, setStatus] = useState<AppDataState<T>>(
    appDataDefaultState
  )

  const callbackRef = useRef<Function>(() => undefined)
  useEffect(() => {
    callbackRef.current = callback || (() => undefined)
  }, [callback])

  const previousResultJsonRef = useRef<string>('')

  useEffect(() => {
    let cancelled = false
    let subscriptionHandler: SubscriptionHandler | null = null

    const update = async () => {
      // keep the result until the next update
      setStatus((status) => ({ ...status, error: null, loading: true }))

      try {
        const result = await callbackRef.current()

        if (cancelled || result === undefined) {
          return
        }

        // Subscription
        if (typeof result === 'function') {
          subscriptionHandler = result((error: Error | null, result?: any) => {
            if (cancelled) {
              return
            }

            if (error) {
              setStatus({ error, loading: false, result: undefined })
              previousResultJsonRef.current = JSON.stringify(null)
              return
            }

            const resultJson = JSON.stringify(result)
            if (resultJson === previousResultJsonRef.current) {
              // no update
              return
            }

            previousResultJsonRef.current = resultJson
            setStatus({ error: null, loading: false, result })
          })

          // Just async data
        } else {
          setStatus({ error: null, loading: false, result })
        }
      } catch (err) {
        if (!cancelled) {
          setStatus({ error: err, loading: false, result: undefined })
        }
      }
    }
    update()

    return () => {
      cancelled = true
      subscriptionHandler?.unsubscribe()
    }
  }, dependencies || [])

  const status = useMemo(() => ({ error, loading, retry: () => null }), [
    error,
    loading,
  ])

  return [result, status]
}

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
  }, [callback, org, orgLoading])

  useEffect(() => {
    subscribe()
  }, [subscribe])

  useEffect(() => {
    return () => {
      cancelCb.current?.()
    }
  }, [])

  return [data, { error, loading, retry: subscribe }]
}

export function useOrganization(): OrganizationHookResult {
  const { org, orgStatus } = useConnectContext()
  return [org, orgStatus]
}

export function useApp(
  appsFilter?: AppFiltersParam
): [App | null, LoadingStatus] {
  const callback = useCallback(
    (org, onData) => {
      return org.onApp(appsFilter, onData)
    },
    [JSON.stringify(appsFilter)]
  )
  return useSubscription<App | null>(callback, null)
}

export function useApps(appsFilter?: AppFiltersParam): [App[], LoadingStatus] {
  const callback = useCallback(
    (org, onData) => {
      return org.onApps(appsFilter, onData)
    },
    [JSON.stringify(appsFilter)]
  )
  return useSubscription<App[]>(callback, [])
}

export function usePermissions(): [Permission[], LoadingStatus] {
  const callback = useCallback((org, onData) => {
    return org.onPermissions(onData)
  }, [])
  return useSubscription<Permission[]>(callback, [])
}
