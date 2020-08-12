import { networkFromChainId, networkFromName, toNetwork } from '../network'
import { NETWORKS } from '../../params'

const netw = (index: number) => NETWORKS[index]

describe('networkFromChainId()', () => {
  test('Should return existing networks', () => {
    expect(networkFromChainId(netw(0).chainId)).toStrictEqual(netw(0))
    expect(networkFromChainId(-1)).toBe(null)
  })
})

describe('networkFromName()', () => {
  test('Should return existing networks', () => {
    expect(networkFromName(netw(0).name)).toStrictEqual(netw(0))
    expect(networkFromName('invalid')).toBe(null)
  })
})

describe('toNetwork()', () => {
  test('Should accept a known chainId', () => {
    expect(toNetwork(netw(0).chainId)).toStrictEqual(netw(0))
    expect(() => toNetwork(-1)).toThrow()
  })
  test('Should throw if the chainId is missing or unknown', () => {
    expect(() => toNetwork({ chainId: undefined! })).toThrow()
    expect(() => toNetwork({ chainId: -1 })).toThrow()
  })
  test('Should accept a known name without chainId', () => {
    expect(toNetwork(netw(0).name)).toStrictEqual(netw(0))
    expect(toNetwork({ name: netw(0).name })).toStrictEqual(netw(0))
    expect(() => toNetwork('unknown name')).toThrow()
    expect(() => toNetwork({ name: 'unknown name' })).toThrow()
    expect(() => toNetwork({ name: '' })).toThrow()
  })
  test('Should accept unknown names with a chainId', () => {
    expect(
      toNetwork({ chainId: netw(0).chainId, name: 'unknown name' })
    ).toStrictEqual({ ...netw(0), name: 'unknown name' })
    expect(toNetwork({ chainId: netw(0).chainId, name: '' })).toStrictEqual({
      ...netw(0),
      name: '',
    })
  })
  test('Should allow any ensAddress', () => {
    expect(
      toNetwork({
        chainId: netw(0).chainId,
        ensAddress: '0xcafecafecafecafecafecafecafecafecafecafe',
      })
    ).toStrictEqual({
      ...netw(0),
      ensAddress: '0xcafecafecafecafecafecafecafecafecafecafe',
    })
  })
  test('Should throw when a falsy value gets passed', () => {
    expect(() => toNetwork(undefined!)).toThrow()
  })
})
