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
type AppsHookResult = [App[], LoadingStatus]
type PermissionsHookResult = [Permission[], LoadingStatus]

const ConnectContext = React.createContext<ContextValue>({
  org: null,
  orgLoadingStatus: { error: null, loading: false, retry: () => {} },
})

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

export function useOrganization(): OrganizationHookResult {
  const { org, orgLoadingStatus } = useContext<ContextValue>(ConnectContext)
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
  const { org } = useContext<ContextValue>(ConnectContext)
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
      console.log('CANCEL SUB!')
      cancelled = true
      handler?.unsubscribe?.()
    }

    console.log('START SUB!')
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

export function useApps(): AppsHookResult {
  return useConnectSubscription<App[]>((org, onData) => {
    console.log('SUB: APPS')
    return org.onApps(onData)
  }, [])
}

export function usePermissions(): PermissionsHookResult {
  return useConnectSubscription<Permission[]>((org, onData) => {
    console.log('SUB: PERMS')
    return org.onPermissions(onData)
  }, [])
}

export * from '@aragon/connect'
