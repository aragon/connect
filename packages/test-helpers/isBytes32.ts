export function isBytes32(value: string): boolean {
  return /^0x[0-9a-f]{64}$/i.test(value)
}
