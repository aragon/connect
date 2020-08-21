import React, {
  createElement,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { AppFiltersParam, SubscriptionHandler } from '@aragon/connect-types'
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
  const [org, setOrg] = useState<Organization | null>(null)
  const [orgError, setOrgError] = useState<Error | null>(null)
  const [orgLoading, setOrgLoading] = useState<boolean>(false)

  const cancelOrgLoading = useRef<Function | null>(null)

  const loadOrg = useCallback(() => {
    let cancelled = false

    cancelOrgLoading.current?.()
    cancelOrgLoading.current = () => {
      cancelled = true
    }

    setOrg(null)
    setOrgLoading(true)

    const update = async () => {
      const done = (err: Error | null, org: Organization | null) => {
        if (!cancelled) {
          setOrgLoading(false)
          setOrgError(err || null)
          setOrg(err ? null : org)
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
  }, [location, connector, options])

  useEffect(loadOrg, [location, connector, options])

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
    onData: (data: Data) => void
  ) => SubscriptionHandler,
  initValue: Data
): [Data, LoadingStatus] {
  const [data, setData] = useState<Data>(initValue)
  const [loading, setLoading] = useState<boolean>(false)
  const {
    org,
    orgStatus: { loading: orgLoading },
  } = useConnectContext()

  const cancelCb = useRef<Function | null>(null)

  const subscribe = useCallback(() => {
    if (!org) {
      // If the org is loading, the subscription is loading as well.
      setLoading(orgLoading)
      setData(initValue)
      return
    }

    let cancelled = false
    let handler: any

    cancelCb.current?.()
    cancelCb.current = () => {
      cancelled = true
      handler?.unsubscribe?.()
    }

    setLoading(true)
    handler = callback(org, (data: Data) => {
      if (!cancelled) {
        setData(data)
        setLoading(false)
      }
    })
  }, [org, orgLoading, callback])

  useEffect(() => {
    subscribe()
  }, [subscribe])

  return [data, { error: null, loading, retry: subscribe }]
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
    callback?: (app: App | any) => T | Promise<T>,
    dependencies?: any[]
  ): [T | null, LoadingStatus] {
    const [result, setResult] = useState<T | null>(null)
    const [error, setError] = useState<Error | null>(null)
    const [loading, setLoading] = useState<boolean>(false)
    const callbackRef = useRef<Function>((app: App) => app)

    useEffect(() => {
      callbackRef.current = callback || ((app: App) => app)
    }, [callback])

    useEffect(() => {
      let cancelled = false

      setResult(null)
      setError(null)

      const update = async () => {
        setLoading(true)

        try {
          const connectedApp = await appConnect(updatedApp, connector)
          const result = await callbackRef.current(connectedApp)
          if (!cancelled) {
            setLoading(false)
            setResult(result)
          }
        } catch (err) {
          if (!cancelled) {
            setLoading(false)
            setError(err)
          }
        }
      }

      if (app) {
        update()
      }

      return () => {
        cancelled = true
      }
    }, [connector, app, ...(dependencies || [])])

    return [result, { error, loading, retry: () => null }]
  }
}

export * from '@aragon/connect'
