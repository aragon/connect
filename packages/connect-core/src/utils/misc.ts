import { Address, Network, Networkish } from '@aragon/connect-types'
import { NETWORKS } from '../params'

export function toArrayEntry<T>(value: T | T[]): T[] {
  return Array.isArray(value) ? value : [value]
}

export function networkFromChainId(chainId: number): Network | null {
  return NETWORKS.find((network) => network.chainId === chainId) || null
}

export function networkFromName(name: string): Network | null {
  return NETWORKS.find((network) => network.name === name) || null
}

export function ensAddressFromChainId(chainId: number): Address | null {
  return (
    NETWORKS.find((network) => network.chainId === chainId)?.ensAddress || null
  )
}

export function toNetwork(value: Networkish): Network {
  let network: Network | null

  if (typeof value === 'number') {
    network = networkFromChainId(value)
    if (!network) {
      throw new Error(
        `Network: invalid chainId provided: ${value}. ` +
          `Please use one of the following: ${NETWORKS.map(
            (network) => network.name
          ).join(', ')}.`
      )
    }
    return network
  }

  if (typeof value === 'string') {
    network = networkFromName(value)
    if (!network) {
      throw new Error(
        `Network: invalid name provided: ${value}. ` +
          `Please use one of the following: ${NETWORKS.map(
            (network) => network.chainId
          ).join(', ')}.`
      )
    }
    return network
  }

  if (!value) {
    throw new Error(`Network: incorrect value provided.`)
  }

  if (value.chainId === undefined) {
    throw new Error(`Network: no chainId provided.`)
  }

  if (value.name === undefined) {
    throw new Error(`Network: no name provided.`)
  }

  const ensAddress = value.ensAddress || ensAddressFromChainId(value.chainId)

  if (!ensAddress) {
    throw new Error(
      `Network: no ensAddress provided. ` +
        `Please set one, or use one of the following chainId: ${NETWORKS.map(
          (network) => network.name
        ).join(', ')}.`
    )
  }

  return { ...value, ensAddress }
}
