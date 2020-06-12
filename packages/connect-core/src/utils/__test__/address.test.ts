import { addressesEqual, includesAddress, ANY_ENTITY } from '../address'

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

test('Should check if an array include an Ethereum address', () => {
  expect(
    includesAddress(
      [
        '0xb4124cEB3451635DAcedd11767f004d8a28c6eE7',
        '0x8401Eb5ff34cc943f096A32EF3d5113FEbE8D4Eb',
        ANY_ENTITY,
      ],
      '0xb4124cEB3451635DAcedd11767f004d8a28c6eE7'
    )
  ).toBe(true)

  expect(
    includesAddress([ANY_ENTITY], '0xb4124cEB3451635DAcedd11767f004d8a28c6eE7')
  ).toBe(false)
})
