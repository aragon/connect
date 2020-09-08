import { BigNumber, utils } from 'ethers'

export const PCT_DECIMALS = 16 // 100% = 10^18

export const PCT_BASE = BigNumber.from(`100${'0'.repeat(PCT_DECIMALS)}`)

export const bn = (x: string | number): BigNumber => BigNumber.from(x.toString())

export const formatBn = (
  number: string | BigNumber,
  numberDecimals: string | number,
  formattedDecimals = 2
): string => {
  const formattedNumber = utils.formatUnits(number, numberDecimals)
  const decimalPosition = formattedNumber.indexOf('.')

  if (decimalPosition === -1) {
    return `${formattedNumber}.${'0'.repeat(formattedDecimals)}`
  }

  const decimals = formattedNumber.substring(decimalPosition + 1)
  const decimalsLength = decimals.length

  if (decimalsLength <= formattedDecimals) {
    return `${formattedNumber}${'0'.repeat(formattedDecimals - decimalsLength)}`
  }

  const integer = formattedNumber.substring(0, decimalPosition)
  const roundedDecimals = Math.round(
    parseInt(decimals) / 10 ** (decimalsLength - formattedDecimals)
  )
  return `${integer}.${roundedDecimals}`
}
