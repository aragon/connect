export type Network = {
  name: string
  chainId: number
  ensAddress?: string
}

export type Networkish = Network | string | number

export type AppFilters = {
  address?: string[]
  name?: string[]
}
