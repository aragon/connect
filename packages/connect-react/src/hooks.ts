import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
  AppFiltersParam,
  SubscriptionCallback,
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

type HookResult<T> = [T | undefined, LoadingStatus]

const appDataDefaultState = {
  error: null,
  loading: true,
  result: undefined,
}

export function useConnectData<T = any>(
  callback?: () => T | Promise<T> | SubscriptionResult<T> | undefined,
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
    let subscriptionHandler: SubscriptionHandler | null | undefined = null

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

export function useOrganization(): OrganizationHookResult {
  const { org, orgStatus } = useConnectContext()
  return [org, orgStatus]
}

export function useApp(appsFilter?: AppFiltersParam): HookResult<App | null> {
  const [org] = useOrganization()
  const cb = () => org?.onApp(appsFilter)
  const deps = [org, JSON.stringify(appsFilter)]
  return useConnectData<App | null>(cb, deps)
}

export function useApps(appsFilter?: AppFiltersParam): HookResult<App[]> {
  const [org] = useOrganization()
  const cb = org?.onApps(appsFilter)
  const deps = [org, JSON.stringify(appsFilter)]
  return useConnectData<App[]>(cb, deps)
}

export function usePermissions(): HookResult<Permission[]> {
  const [org] = useOrganization()
  const cb = () => org?.onPermissions()
  const deps = [org]
  return useConnectData<Permission[]>(cb, deps)
}
