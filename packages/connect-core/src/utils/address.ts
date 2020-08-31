import { AppOrAddress } from '../types'

export const ANY_ENTITY = '0xFFfFfFffFFfffFFfFFfFFFFFffFFFffffFfFFFfF'

// Check address equality without checksums
export function addressesEqual(first: string, second: string): boolean {
  first = first && first.toLowerCase()
  second = second && second.toLowerCase()
  return first === second
}

// "Safer" version of [].includes() for addresses
export function includesAddress(arr: string[], address: string): boolean {
  return arr.some((a) => addressesEqual(a, address))
}

export function normalizeAddress(app: AppOrAddress): string {
  if (typeof app === 'string') {
    return app
  }
  return app.address
}
