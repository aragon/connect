import { Address } from '@aragon/connect-types'
import { providers as ethersProviders } from 'ethers'

import { calculateTransactionPath } from './calculatePath'
import App from '../../entities/App'
import ForwardingPath from '../../entities/ForwardingPath'

/**
 * Calculate the transaction path for a transaction to `destination`
 * that invokes `methodSignature` with `params`.
 *
 * @param  {string} destination
 * @param  {string} methodSignature
 * @param  {Array<*>} params
 * @param  {string} [finalForwarder] Address of the final forwarder that can perfom the action
 * @return {Promise<Array<Object>>} An array of Ethereum transactions that describe each step in the path
 */
export async function getForwardingPath(
  sender: Address,
  destinationApp: App,
  methodSignature: string,
  params: any[],
  installedApps: App[],
  provider: ethersProviders.Provider,
  finalForwarder?: Address
): Promise<ForwardingPath> {
  const { path, transactions } = await calculateTransactionPath(
    sender,
    destinationApp,
    methodSignature,
    params,
    installedApps,
    provider,
    finalForwarder
  )

  return new ForwardingPath(
    {
      destination: destinationApp,
      path,
      transactions,
    },
    installedApps,
    provider
  )
}
