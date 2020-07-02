import React, {
  createElement,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import {
  Application,
  ConnectOptions,
  ConnectorDeclaration,
  Organization,
  Permission,
  connect,
} from '@aragon/connect'

type ContextValue = {
  org: Organization | null
  orgError: Error | null
  orgLoading: boolean
}

type ConnectProps = {
  children: React.ReactNode
  connector: ConnectorDeclaration
  location: string
  options?: ConnectOptions
}

type OrganizationHookResult = [Organization | null, Error | null, boolean]
type AppsHookResult = [Application[], Error | null, boolean]
type PermissionsHookResult = [Permission[], Error | null, boolean]

const ConnectContext = React.createContext<ContextValue>({
  org: null,
  orgError: null,
  orgLoading: false,
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

  useEffect(() => {
    let cancelled = false

    const update = async () => {
      setOrgLoading(true)
      try {
        const org = await connect(location, connector, options)
        if (!cancelled) {
          setOrgError(null)
          setOrg(org)
        }
      } catch (err) {
        if (!cancelled) {
          setOrgError(err)
          setOrg(null)
        }
      } finally {
        if (!cancelled) {
          setOrgLoading(false)
        }
      }
    }

    update()

    return () => {
      cancelled = true
    }
  }, [location, connector, options])

  const value = useMemo<ContextValue>(() => ({ org, orgError, orgLoading }), [
    org,
    orgError,
    orgLoading,
  ])

  return createElement(ConnectContext.Provider, { value, children })
}

export function useOrganization(): OrganizationHookResult {
  const { org, orgError, orgLoading } = useContext<ContextValue>(ConnectContext)
  return [org, orgError, orgLoading]
}

function useConnectSubscription<Data>(
  cb: (
    org: Organization,
    onData: (data: Data) => void
  ) => { unsubscribe: Function },
  initValue: Data
): [Data, Error | null, boolean] {
  const [data, setData] = useState<Data>(initValue)
  const [loading, setLoading] = useState<boolean>(false)
  const { org } = useContext<ContextValue>(ConnectContext)
  const cbRef = useRef(cb)

  useEffect(() => {
    if (!org) {
      return
    }

    let handler: any

    const update = async () => {
      setLoading(true)

      handler = cbRef.current(org, (data: Data) => {
        setData(data)
        setLoading(false)
      })
    }
    update()

    return () => {
      handler?.unsubscribe?.()
    }
  }, [org])

  return [data, null, loading]
}

export function useApps(): AppsHookResult {
  return useConnectSubscription<Application[]>(
    (org, onData) => org.onApps(onData),
    []
  )
}

export function usePermissions(): PermissionsHookResult {
  return useConnectSubscription<Permission[]>(
    (org, onData) => org.onPermissions(onData),
    []
  )
}

export * from '@aragon/connect'
