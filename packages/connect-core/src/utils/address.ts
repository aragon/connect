import { Address } from '@aragon/connect-types'
import { utils as ethersUtils } from 'ethers'

export const ANY_ENTITY = '0xFFfFfFffFFfffFFfFFfFFFFFffFFFffffFfFFFfF'

// Check address equality without checksums
export function addressesEqual(first: Address, second: Address): boolean {
  first = first && first.toLowerCase()
  second = second && second.toLowerCase()
  return first === second
}

// "Safer" version of [].includes() for addresses
export function includesAddress(arr: Address[], address: Address): boolean {
  return arr.some((a) => addressesEqual(a, address))
}

export function isAddress(address: string): boolean {
  return ethersUtils.isAddress(address)
}
