import type { Address } from '@1hive/connect-types'
import { isAddress } from '@ethersproject/address'
import { Provider } from '@ethersproject/providers'
import { ErrorInvalidLocation } from '../errors'

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

export async function resolveAddress(
  ethersProvider: Provider,
  location: string
): Promise<Address> {
  const isLocationAddress = isAddress(location)

  const address = isLocationAddress
    ? location
    : await ethersProvider.resolveName(location)

  if (!isAddress(address)) {
    throw new ErrorInvalidLocation(
      isLocationAddress
        ? `The address (${address}) is not valid.`
        : `The ENS domain (${location}) doesn’t seem to resolve to an address.`
    )
  }

  return address
}
