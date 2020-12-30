import { createContext, useContext } from 'react'
import { ContextValue } from './types'

export const ConnectContext = createContext<ContextValue | null>(null)

export function useConnectContext(): ContextValue {
  const contextValue = useContext(ConnectContext)
  if (contextValue === null) {
    throw new Error(
      'The <Connect /> component need to be declared in order to use the provided hooks.'
    )
  }
  return contextValue
}
