import React, {
  createElement,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import {
  AppFiltersParam,
  SubscriptionHandler,
  SubscriptionResult,
} from '@aragon/connect-types'
import {
  App,
  ConnectOptions,
  ConnectorDeclaration,
  Organization,
  Permission,
  connect,
} from '@aragon/connect'

type ConnectProps = {
  children: React.ReactNode
  connector: ConnectorDeclaration
  location: string
  options?: ConnectOptions
}
type ContextValue = {
  org: Organization | null
  orgStatus: LoadingStatus
}
type LoadingStatus = {
  error: Error | null
  loading: boolean
  retry: () => void
}
type OrganizationHookResult = [
  Organization | null,
  { error: Error | null; loading: boolean; retry: () => void }
]

const ConnectContext = React.createContext<ContextValue | null>(null)

export function Connect({
  children,
  connector,
  location,
  options,
}: ConnectProps): JSX.Element {
  const [{ org, orgError, orgLoading }, setOrgStatus] = useState<{
    org: Organization | null
    orgError: Error | null
    orgLoading: boolean
  }>({
    org: null,
    orgError: null,
    orgLoading: true,
  })

  const cancelOrgLoading = useRef<Function | null>(null)

  // If the connector is custom instance, it is the responsibility of the provider to memoize it.
  const connectorUpdateValue =
    Array.isArray(connector) || typeof connector === 'string'
      ? JSON.stringify(connector)
      : connector
  const optionsUpdateValue = JSON.stringify(options)

  const loadOrg = useCallback(() => {
    let cancelled = false

    cancelOrgLoading.current?.()
    cancelOrgLoading.current = () => {
      cancelled = true
    }

    setOrgStatus((status) => ({
      ...status,
      org: null,
      orgLoading: true,
    }))

    const update = async () => {
      const done = (err: Error | null, org: Organization | null) => {
        if (!cancelled) {
          setOrgStatus({
            org: err ? null : org,
            orgError: err || null,
            orgLoading: false,
          })
        }
      }

      try {
        const org = await connect(location, connector, options)
        done(null, org)
      } catch (err) {
        done(err, null)
      }
    }
    update()
  }, [location, connectorUpdateValue, optionsUpdateValue])

  useEffect(() => {
    loadOrg()
  }, [location, connectorUpdateValue, optionsUpdateValue])

  const value = useMemo<ContextValue>(
    () => ({
      org,
      orgStatus: {
        error: orgError,
        loading: orgLoading,
        retry: loadOrg,
      },
    }),
    [org, orgError, orgLoading, loadOrg]
  )

  return createElement(ConnectContext.Provider, { value, children })
}

function useConnectContext(): ContextValue {
  const contextValue = useContext(ConnectContext)
  if (contextValue === null) {
    throw new Error(
      'The <Connect /> component need to be declared in order to use the provided hooks.'
    )
  }
  return contextValue
}

export function useOrganization(): OrganizationHookResult {
  const { org, orgStatus } = useConnectContext()
  return [org, orgStatus]
}

function useConnectSubscription<Data>(
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
  }, [callback, initValueRef, org, orgLoading])

  useEffect(() => {
    subscribe()
  }, [subscribe])

  return [data, { error, loading, retry: subscribe }]
}

export function useApp(
  appsFilter?: AppFiltersParam
): [App | null, LoadingStatus] {
  const callback = useCallback((org, onData) => org.onApp(appsFilter, onData), [
    JSON.stringify(appsFilter),
  ])
  return useConnectSubscription<App | null>(callback, null)
}

export function useApps(appsFilter?: AppFiltersParam): [App[], LoadingStatus] {
  const callback = useCallback(
    (org, onData) => org.onApps(appsFilter, onData),
    [JSON.stringify(appsFilter)]
  )
  return useConnectSubscription<App[]>(callback, [])
}

export function usePermissions(): [Permission[], LoadingStatus] {
  const callback = useCallback((org, onData) => org.onPermissions(onData), [])
  return useConnectSubscription<Permission[]>(callback, [])
}

export function createAppHook(
  appConnect: Function,
  connector?: string | [string, { [key: string]: any } | undefined]
) {
  return function useAppData<T = any>(
    app: App | null,
    callback?: (app: App | any) => T | Promise<T> | SubscriptionResult<T>,
    dependencies?: any[]
  ): [T | undefined, LoadingStatus] {
    const [{ result, error, loading }, setStatus] = useState<{
      error: Error | null
      loading: boolean
      result?: T
    }>({
      error: null,
      loading: true,
      result: undefined,
    })

    const callbackRef = useRef<Function>((app: App) => app)

    useEffect(() => {
      callbackRef.current = callback || ((app: App) => app)
    }, [callback])

    const appJsonRef = useRef<string>('')
    const [updatedApp, setUpdatedApp] = useState<App | null>(null)
    useEffect(() => {
      const appJson = JSON.stringify(app)
      if (appJson !== appJsonRef.current) {
        setUpdatedApp(app)
        appJsonRef.current = appJson
      }
    }, [app])

    useEffect(() => {
      let cancelled = false
      let subscriptionHandler: SubscriptionHandler | null = null

      setStatus((status) => ({
        ...status,
        error: null,
        result: undefined,
      }))

      const update = async () => {
        setStatus((status) => ({
          ...status,
          loading: true,
        }))

        try {
          const connectedApp = await appConnect(updatedApp, connector)
          const result = await callbackRef.current(connectedApp)
          if (cancelled) {
            return
          }

          // Subscription
          if (typeof result === 'function') {
            subscriptionHandler = result(
              (error: Error | null, result?: any) => {
                if (!cancelled) {
                  setStatus({
                    error: error || null,
                    loading: false,
                    result: error ? undefined : result,
                  })
                }
              }
            )

            // Just async data
          } else {
            setStatus({
              error: null,
              loading: false,
              result,
            })
          }
        } catch (err) {
          if (!cancelled) {
            setStatus({
              error: err,
              loading: false,
              result: undefined,
            })
          }
        }
      }

      if (updatedApp) {
        update()
      }

      return () => {
        cancelled = true
        subscriptionHandler?.unsubscribe()
      }
    }, [connector, updatedApp, ...(dependencies || [])])

    return [result, { error, loading, retry: () => null }]
  }
}

export * from '@aragon/connect'
