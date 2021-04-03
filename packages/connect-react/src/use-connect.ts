import { useEffect, useMemo, useRef, useReducer, Reducer } from 'react'
import {
  AppFiltersParam,
  SubscriptionCallback,
  SubscriptionHandler,
  SubscriptionStart,
  isSubscriptionStart,
} from '@1hive/connect-types'
import { Organization } from '@1hive/connect'
import { UseConnectCallback, UseConnectResult } from './types'
import { useConnectContext } from './connect-context'
import { hash } from './utils'

type Status<T> = {
  error: Error | null
  loading: boolean
  result: T | undefined
}

type StatusAction<T> =
  | { type: 'loading' }
  | { type: 'error'; error: Error }
  | { type: 'done'; result: T }

function statusReducer<T>(
  state: Status<T>,
  action: StatusAction<T>
): Status<T> {
  if (action.type === 'loading') {
    return state.loading
      ? state
      : { error: null, loading: true, result: undefined }
  }
  if (action.type === 'error') {
    return state.error === action.error
      ? state
      : { error: action.error, loading: false, result: undefined }
  }
  if (action.type === 'done') {
    return hash(state.result) === hash(action.result)
      ? state
      : { error: null, loading: false, result: action.result }
  }
  return state
}

const statusInitial = {
  error: null,
  loading: true,
  result: undefined,
}

export function useConnect<T>(
  callback: UseConnectCallback<T>,
  dependencies?: unknown[]
): UseConnectResult<T>

export function useConnect(): UseConnectResult<Organization>

export function useConnect<T>(callback?: any, dependencies?: unknown[]): any {
  const { org, orgStatus } = useConnectContext()

  const [{ result, error, loading }, setStatus] = useReducer<
    Reducer<Status<T>, StatusAction<T>>
  >(statusReducer, statusInitial as Status<T>)

  if (callback === undefined) {
    callback = ((org) => org) as UseConnectCallback<Organization>
  }

  useEffect(() => {
    let cancelled = false
    let subscriptionHandler: SubscriptionHandler | null | undefined = null

    const update = async () => {
      setStatus({ type: 'loading' })

      try {
        if (!org) {
          if (orgStatus.error !== null) {
            setStatus({ type: 'error', error: orgStatus.error })
          }
          return
        }

        const result = await callback(org)

        if (cancelled || result === undefined) {
          return
        }

        // Subscription
        if (isSubscriptionStart<T>(result)) {
          subscriptionHandler = result((error: Error | null, result?: any) => {
            if (cancelled) {
              return
            }
            if (error) {
              setStatus({ type: 'error', error })
              return
            }
            setStatus({ type: 'done', result })
          })

          // Just async data
        } else {
          setStatus({ type: 'done', result })
        }
      } catch (err) {
        if (!cancelled) {
          setStatus({ type: 'error', error: err })
        }
      }
    }
    update()

    return () => {
      cancelled = true
      subscriptionHandler?.unsubscribe()
    }
  }, [org, ...(dependencies || [])])

  return useMemo(() => [result, { error, loading, retry: () => null }], [
    result,
    error,
    loading,
  ])
}
