import React, {
  createElement,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { AppFiltersParam } from '@aragon/connect-types'
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
  ) => { unsubscribe: Function },
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

export * from '@aragon/connect'
