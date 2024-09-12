import { BigNumber } from 'ethers'

export const bn = (x: string | number): BigNumber => BigNumber.from(x.toString())
