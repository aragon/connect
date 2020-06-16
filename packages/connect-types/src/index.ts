export type Network = {
  name: string
  chainId: number
  ensAddress?: string
}

export type Networkish = Network | string | number
