import { BigNumber } from 'ethers'
import { bn } from './numbers'

export const currentTimestampEvm = (): BigNumber => bn(Math.floor(Date.now() / 1000))
