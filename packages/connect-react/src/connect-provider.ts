import {
  createElement,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { Organization, connect } from '@aragon/connect'
import { ConnectProps, ContextValue } from './types'
import { ConnectContext } from './connect-context'

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
