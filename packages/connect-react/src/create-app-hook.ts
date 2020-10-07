import { useEffect, useRef, useState } from 'react'
import { SubscriptionResult } from '@aragon/connect-types'
import { App, warn } from '@aragon/connect-core'
import { useConnect } from './use-connect'

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

    return useConnect(() => {
      if (appError) {
        throw appError
      }
      return connectedApp ? callbackRef.current(connectedApp) : undefined
    }, [...(dependencies || []), connectedApp, appError])
  }
}
