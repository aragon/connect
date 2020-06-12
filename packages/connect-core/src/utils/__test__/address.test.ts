import { addressesEqual } from '../address'

test('Should check if string is an Ethereum address', () => {
  expect(
    addressesEqual(
      '0xb4124cEB3451635DAcedd11767f004d8a28c6eE7',
      '0xb4124cEB3451635DAcedd11767f004d8a28c6eE7'
    )
  ).toBe(true)

  expect(
    addressesEqual(
      '0xb4124cEB3451635DAcedd11767f004d8a28c6eE7',
      '0xg4124cEB3451635DAcedd11767f004d8a28c6eE7'
    )
  ).toBe(false)
})
