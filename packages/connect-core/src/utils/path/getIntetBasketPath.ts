import { providers as ethersProviders, utils as ethersUtils } from 'ethers'

import App from '../../entities/App'
import Transaction from '../../entities/Transaction'
import { addressesEqual, includesAddress, ANY_ENTITY } from '../address'
import { getAppMethod } from '../app'
import { encodeCallScript } from '../callScript'
import { canForward } from '../forwarding'
import {
  createDirectTransactionForApp,
  createForwarderTransactionBuilder,
  buildForwardingFeePretransaction,
} from '../transactions'

// /**
//  * Calculate the transaction path for a basket of intents.
//  * Expects the `intentBasket` to be an array of tuples holding the following:
//  *   {string}   destination: destination address
//  *   {string}   methodSignature: method to invoke on destination
//  *   {Array<*>} params: method params
//  * These are the same parameters as the ones used for `getTransactionPath()`
//  *
//  * Allows user to specify how many of the intents should be checked to ensure their paths are
//  * compatible. `checkMode` supports:
//  *   'all': All intents will be checked to make sure they use the same forwarding path.
//  *   'single': assumes all intents can use the path found from the first intent
//  *
//  * @param  {Array<Array<string, string, Array<*>>>} intentBasket Intents
//  * @param  {Object} [options]
//  * @param  {string} [options.checkMode] Path checking mode
//  * @return {Promise<Object>} An object containing:
//  *   - `path` (Array<Object>): a multi-step transaction path that eventually invokes this basket.
//  *     Empty if no such path could be found.
//  *   - `transactions` (Array<Object>): array of Ethereum transactions that invokes this basket.
//  *     If a multi-step transaction path was found, returns the first transaction in that path.
//  *     Empty if no such transactions could be found.
//  */
// async getTransactionPathForIntentBasket (intentBasket, { checkMode = 'all' } = {}) {
//   // Get transaction paths for entire basket
//   const intentsToCheck =
//     checkMode === 'all'
//       ? intentBasket // all -- use all intents
//       : checkMode === 'single'
//         ? [intentBasket[0]] // single -- only use first intent
//         : []
//   const intentPaths = await Promise.all(
//     intentsToCheck.map(
//       ([destination, methodSignature, params]) =>
//         addressesEqual(destination, this.aclProxy.address)
//           ? this.getACLTransactionPath(methodSignature, params)
//           : this.getTransactionPath(destination, methodSignature, params)
//     )
//   )

//   // If the paths don't match, we can't send the transactions in this intent basket together
//   const pathsMatch = doIntentPathsMatch(intentPaths)
//   if (pathsMatch) {
//     // Create direct transactions for each intent in the intentBasket
//     const sender = (await this.getAccounts())[0] // TODO: don't assume it's the first account
//     const directTransactions = await Promise.all(
//       intentBasket.map(
//         async ([destination, methodSignature, params]) =>
//           createDirectTransactionForApp(sender, await this.getApp(destination), methodSignature, params, this.web3)
//       )
//     )

//     if (intentPaths[0].length === 1) {
//       // Sender has direct access
//       try {
//         const decoratedTransactions = await this.describeTransactionPath(
//           await Promise.all(
//             directTransactions.map(transaction => this.applyTransactionGas(transaction))
//           )
//         )

//         return {
//           path: [],
//           transactions: decoratedTransactions
//         }
//       } catch (_) { }
//     } else {
//       // Need to encode calls scripts for each forwarder transaction in the path
//       const createForwarderTransaction = createForwarderTransactionBuilder(sender, {}, this.web3)
//       const forwarderPath = intentPaths[0]
//         // Ignore the last part of the path, which was the original intent
//         .slice(0, -1)
//         // Start from the "last" forwarder and move backwards to the sender
//         .reverse()
//         // Just use the forwarders' addresses
//         .map(({ to }) => to)
//         .reduce(
//           (path, nextForwarder) => {
//             const lastStep = path[0]
//             const encodedLastStep = encodeCallScript(Array.isArray(lastStep) ? lastStep : [lastStep])
//             return [createForwarderTransaction(nextForwarder, encodedLastStep), ...path]
//           },
//           // Start the recursive calls script encoding with the direct transactions for the
//           // intent basket
//           [directTransactions]
//         )

//       try {
//         // Put the finishing touches: apply gas, and add radspec descriptions
//         forwarderPath[0] = await this.applyTransactionGas(forwarderPath[0], true)
//         return {
//           path: await this.describeTransactionPath(forwarderPath),
//           // When we have a path, we only need to send the first transaction to start it
//           transactions: [forwarderPath[0]]
//         }
//       } catch (_) { }
//     }
//   }

//   // Failed to find a path
//   return {
//     path: [],
//     transactions: []
//   }
// }
