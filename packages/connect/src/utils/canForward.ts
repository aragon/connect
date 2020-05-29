import { ethers } from 'ethers'

import { forwarderAbi } from './abis'

/**
 * Whether the `sender` can use the `forwarder` to invoke `script`.
 */
export function canForward(
  forwarderAddress: string,
  sender: string,
  script: string,
  provider: ethers.providers.Provider
): Promise<boolean> {
  // Check if a token approval pretransaction is needed due to the forwarder requiring a fee
  const forwarder = new ethers.Contract(
    forwarderAddress,
    forwarderAbi,
    provider
  )

  return forwarder.canForward(sender, script).catch(() => false)
}
