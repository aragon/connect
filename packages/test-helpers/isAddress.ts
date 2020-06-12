export function isAddress(value: string): boolean {
  return /^0x[0-9a-f]{40}$/i.test(value)
}
