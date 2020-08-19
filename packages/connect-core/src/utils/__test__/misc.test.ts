import { toArrayEntry } from '../misc'

describe('toArrayEntry()', () => {
  test('Should return an array when a non-array is passed', () => {
    expect(toArrayEntry(1)).toStrictEqual([1])
  })
  test('Should return the same value when an array is passed', () => {
    const value = [1]
    expect(toArrayEntry(value)).toBe(value)
  })
})
