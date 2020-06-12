import { addressesEqual, isAddress, ANY_ENTITY } from '../address'

test('Should check if two Ethereum addresses are equal', () => {
  expect(
    addressesEqual(
      '0xb4124cEB3451635DAcedd11767f004d8a28c6eE7',
      '0xb4124cEB3451635DAcedd11767f004d8a28c6eE7'
    )
  ).toBe(true)

  expect(
    addressesEqual('0xb4124cEB3451635DAcedd11767f004d8a28c6eE7', ANY_ENTITY)
  ).toBe(false)
})

test('Should check if two Ethereum addresses are equal', () => {
  expect(isAddress('dumy')).toBe(false)

  expect(
    isAddress('0xb4124cEB3451635DAcedd11767f004d8a28c6eE7'.toLowerCase())
  ).toBe(true)
})
