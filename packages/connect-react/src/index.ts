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
  orgLoadingStatus: LoadingStatus
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
      orgLoadingStatus: {
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
  const { org, orgLoadingStatus } = useConnectContext()
  return [org, orgLoadingStatus]
}

function useConnectSubscription<Data>(
  cb: (
    org: Organization,
    onData: (data: Data) => void
  ) => { unsubscribe: Function },
  initValue: Data
): [Data, LoadingStatus] {
  const [data, setData] = useState<Data>(initValue)
  const [loading, setLoading] = useState<boolean>(false)
  const { org } = useConnectContext()
  const cbRef = useRef(cb)

  const cancelCb = useRef<Function | null>(null)

  const subscribe = useCallback(() => {
    if (!org) {
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
    handler = cbRef.current(org, (data: Data) => {
      if (!cancelled) {
        setData(data)
        setLoading(false)
      }
    })
  }, [org])

  useEffect(subscribe, [subscribe])

  return [data, { error: null, loading, retry: subscribe }]
}

export function useApp(
  appsFilter?: AppFiltersParam
): [App | null, LoadingStatus] {
  return useConnectSubscription<App | null>(
    (org, onData) => org.onApp(appsFilter, onData),
    null
  )
}

export function useApps(appsFilter?: AppFiltersParam): [App[], LoadingStatus] {
  return useConnectSubscription<App[]>(
    (org, onData) => org.onApps(appsFilter, onData),
    []
  )
}

export function usePermissions(): [Permission[], LoadingStatus] {
  return useConnectSubscription<Permission[]>(
    (org, onData) => org.onPermissions(onData),
    []
  )
}

export * from '@aragon/connect'
