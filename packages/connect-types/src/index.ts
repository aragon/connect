export type Network = {
  name: string
  chainId: number
  ensAddress?: string
}

export type Networkish = Network | string | number

// Normalized app fiters
export type AppFilters = {
  address?: string[]
  name?: string[]
}

// App fiters passed by consumers
type AppFiltersAddressParam = string | string[]
export type AppFiltersParam =
  | undefined
  | null
  | AppFiltersAddressParam
  | {
      address?: AppFiltersAddressParam
      name?: string | string[]
    }
