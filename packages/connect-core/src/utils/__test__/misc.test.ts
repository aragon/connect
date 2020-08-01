import {
  ensAddressFromChainId,
  networkFromChainId,
  networkFromName,
  toArrayEntry,
  toNetwork,
} from '../misc'
import { NETWORKS } from '../../params'

describe('toArrayEntry()', () => {
  test('Should return an array when a non-array is passed', () => {
    expect(toArrayEntry(1)).toStrictEqual([1])
  })
  test('Should return the same value when an array is passed', () => {
    const value = [1]
    expect(toArrayEntry(value)).toBe(value)
  })
})

describe('networkFromChainId()', () => {
  test('Should return existing networks', () => {
    expect(networkFromChainId(NETWORKS[0].chainId)).toStrictEqual(NETWORKS[0])
    expect(networkFromChainId(-1)).toBe(null)
  })
})

describe('networkFromName()', () => {
  test('Should return existing networks', () => {
    expect(networkFromName(NETWORKS[0].name)).toStrictEqual(NETWORKS[0])
    expect(networkFromName('invalid')).toBe(null)
  })
})

describe('ensAddressFromChainId()', () => {
  test('Should return existing networks', () => {
    expect(ensAddressFromChainId(NETWORKS[0].chainId)).toStrictEqual(
      NETWORKS[0].ensAddress
    )
    expect(ensAddressFromChainId(-1)).toBe(null)
  })
})

describe('toNetwork()', () => {
  test('Should return existing networks by chainId', () => {
    expect(toNetwork(NETWORKS[0].chainId)).toStrictEqual(NETWORKS[0])
    expect(() => toNetwork(-1)).toThrow()
  })
  test('Should return existing networks by name', () => {
    expect(toNetwork(NETWORKS[0].name)).toStrictEqual(NETWORKS[0])
    expect(() => toNetwork('invalid')).toThrow()
  })
  test('Should allow a network without ensAddress when the chainId is known', () => {
    expect(
      toNetwork({
        chainId: NETWORKS[0].chainId,
        name: NETWORKS[0].name,
      })
    ).toStrictEqual({ ...NETWORKS[0] })
    expect(() =>
      toNetwork({
        chainId: -1,
        name: 'name',
      })
    ).toThrow()
  })
  test('Should not allow incomplete networks to be passed', () => {
    expect(() => toNetwork({ chainId: 1, name: undefined! })).toThrow()
    expect(() => toNetwork({ chainId: undefined!, name: 'name' })).toThrow()
  })
  test('Should throw when a falsy value gets passed', () => {
    expect(() => toNetwork(undefined!)).toThrow()
  })
})
