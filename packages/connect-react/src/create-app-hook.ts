import { useEffect, useMemo, useRef, useState } from 'react'
import { SubscriptionHandler, SubscriptionResult } from '@aragon/connect-types'
import { App } from '@aragon/connect'
import { LoadingStatus } from './types'

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

export function createAppHook(
  appConnect: Function,
  connector?: string | [string, { [key: string]: any } | undefined]
) {
  return function useAppData<T = any>(
    app: App | null,
    callback?: (app: App | any) => T | Promise<T> | SubscriptionResult<T>,
    dependencies?: any[]
  ) {
    // Store the callback as a ref so consumers can declare it inline.
    const callbackRef = useRef<Function>((app: App) => app)
    useEffect(() => {
      callbackRef.current = callback || ((app: App) => app)
    }, [callback])

    const [[connectedApp, appError], setApp] = useState<
      [App | null, Error | null]
    >([null, null])
    const appJsonRef = useRef<string>('')

    useEffect(() => {
      const appJson = JSON.stringify(app)
      // Only update the app when it has changed.
      if (appJson === appJsonRef.current) {
        return
      }
      appJsonRef.current = appJson

      // Don’t try to connect if the app doesn’t exist yet
      if (!app) {
        return
      }

      let cancelled = false
      appConnect(app, connector)
        .then((connectedApp: App) => {
          if (!cancelled) {
            setApp([connectedApp, null])
          }
        })
        .catch((err: Error) => {
          if (!cancelled) {
            setApp([null, err])
          }
        })

      return () => {
        cancelled = true
      }
    }, [app])

    return useConnectData(() => {
      if (appError) {
        throw appError
      }
      return connectedApp ? callbackRef.current(connectedApp) : undefined
    }, [...(dependencies || []), connectedApp, appError])
  }
}
