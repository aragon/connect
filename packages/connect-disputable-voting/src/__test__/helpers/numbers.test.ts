import { bn, formatBn } from '../../helpers'

describe('Number helpers', () => {
  describe('formatBn', () => {
    describe('when using strings', () => {
      test('formats numbers properly', () => {
        expect(formatBn('1000000000000000000', 18)).toBe('1.00')
        expect(formatBn('1000000000000000000', 16)).toBe('100.00')

        expect(formatBn('1000000000000000000', 18, 1)).toBe('1.0')
        expect(formatBn('1000000000000000000', 16, 1)).toBe('100.0')

        expect(formatBn('1000000000000000000', 18, 5)).toBe('1.00000')
        expect(formatBn('1000000000000000000', 16, 5)).toBe('100.00000')

        expect(formatBn('1234560000000000000', 18)).toBe('1.23')
        expect(formatBn('1234560000000000000', 16)).toBe('123.46')

        expect(formatBn('1234560000000000000', 18, 1)).toBe('1.2')
        expect(formatBn('1234560000000000000', 16, 1)).toBe('123.5')

        expect(formatBn('1234560000000000000', 18, 5)).toBe('1.23456')
        expect(formatBn('1234560000000000000', 16, 5)).toBe('123.45600')
      })
    })

    describe('when using BigNumber', () => {
      test('formats numbers properly', () => {
        expect(formatBn(bn('1000000000000000000'), 18)).toBe('1.00')
        expect(formatBn(bn('1000000000000000000'), 16)).toBe('100.00')

        expect(formatBn(bn('1000000000000000000'), 18, 1)).toBe('1.0')
        expect(formatBn(bn('1000000000000000000'), 16, 1)).toBe('100.0')

        expect(formatBn(bn('1000000000000000000'), 18, 5)).toBe('1.00000')
        expect(formatBn(bn('1000000000000000000'), 16, 5)).toBe('100.00000')

        expect(formatBn(bn('1234560000000000000'), 18)).toBe('1.23')
        expect(formatBn(bn('1234560000000000000'), 16)).toBe('123.46')

        expect(formatBn(bn('1234560000000000000'), 18, 1)).toBe('1.2')
        expect(formatBn(bn('1234560000000000000'), 16, 1)).toBe('123.5')

        expect(formatBn(bn('1234560000000000000'), 18, 5)).toBe('1.23456')
        expect(formatBn(bn('1234560000000000000'), 16, 5)).toBe('123.45600')
      })
    })
  })
})
