export type Address = string

export type Network = {
  name: string
  chainId: number
  ensAddress: Address
}

export type Networkish =
  | { name: string; chainId: number; ensAddress?: Address }
  | string
  | number

// Normalized app fiters
export type AppFilters = {
  address?: Address[]
  name?: string[]
}

// App fiters passed by consumers
type AppFiltersNameOrAddress = string | Address
export type AppFiltersParam =
  | undefined
  | null
  | AppFiltersNameOrAddress
  | AppFiltersNameOrAddress[]
  | {
      address?: Address | Address[]
      name?: string | string[]
    }

export type SubscriptionHandler = { unsubscribe: () => void }
