import {
  createElement,
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useRef,
} from 'react'
import { Organization, connect } from '@aragon/connect'
import { ConnectProps, ContextValue } from './types'
import { ConnectContext } from './connect-context'

type OrgStatus = {
  org: Organization | null
  orgError: Error | null
  orgLoading: boolean
}

type OrgStatusAction =
  | { type: 'loading' }
  | { type: 'error'; error: Error }
  | { type: 'done'; org: Organization }

function orgStatusReducer(state: OrgStatus, action: OrgStatusAction) {
  if (action.type === 'loading') {
    return state.orgLoading
      ? state
      : { org: null, orgError: null, orgLoading: true }
  }
  if (action.type === 'error') {
    return state.orgError === action.error
      ? state
      : { org: null, orgError: action.error, orgLoading: false }
  }
  if (action.type === 'done') {
    return state.org === action.org
      ? state
      : { org: action.org, orgError: null, orgLoading: false }
  }
  return state
}

const orgStatusInitial: OrgStatus = {
  org: null,
  orgError: null,
  orgLoading: true,
}

export function Connect({
  children,
  connector,
  location,
  options,
}: ConnectProps): JSX.Element {
  console.log('render connect')
  const [{ org, orgError, orgLoading }, setOrgStatus] = useReducer(
    orgStatusReducer,
    orgStatusInitial
  )

  const cancelOrgLoading = useRef<Function | null>(null)

  const connectorUpdateValue =
    Array.isArray(connector) || typeof connector === 'string'
      ? JSON.stringify(connector)
      : // If the connector is custom instance,
        // it is the responsibility of the provider to memoize it.
        connector

  const optionsUpdateValue = JSON.stringify(options)

  const loadOrg = useCallback(() => {
    let cancelled = false

    console.log('load org');

    cancelOrgLoading.current?.()
    cancelOrgLoading.current = () => {
      cancelled = true
    }

    setOrgStatus({ type: 'loading' })

    const update = async () => {
      try {
        const org = await connect(location, connector, options)
        if (!cancelled) {
          setOrgStatus({ type: 'done', org })
        }
      } catch (err) {
        if (!cancelled) {
          setOrgStatus({ type: 'error', error: err })
        }
      }
    }
    update()
  }, [location, connectorUpdateValue, optionsUpdateValue])

  useEffect(loadOrg, [loadOrg])

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
