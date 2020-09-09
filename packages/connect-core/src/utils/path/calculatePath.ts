import { providers as ethersProviders, utils as ethersUtils } from 'ethers'

import { addressesEqual, includesAddress, ANY_ENTITY } from '../address'
import { findAppMethodFromSignature } from '../app'
import { encodeCallScript } from '../callScript'
import { canForward } from '../forwarding'
import {
  createDirectTransactionForApp,
  createForwarderTransactionBuilder,
  buildForwardingFeePreTransactions,
} from '../transactions'
import { TransactionPath } from '../../types'
import App from '../../entities/App'
import Transaction from '../../entities/Transaction'

/**
 * Calculate the forwarding path for a transaction to `destination`
 * that invokes `directTransaction`.
 *
 */
async function calculateForwardingPath(
  sender: string,
  directTransaction: Transaction,
  forwardersWithPermission: string[],
  forwarders: string[],
  provider: ethersProviders.Provider
): Promise<TransactionPath> {
  // No forwarders can perform the requested action
  if (forwardersWithPermission.length === 0) {
    return { path: [], transactions: [] }
  }

  const createForwarderTransaction = createForwarderTransactionBuilder(
    sender,
    directTransaction
  )

  const buildForwardingPath = async (
    forwarder: string,
    script: string,
    path: Transaction[],
    provider: ethersProviders.Provider
  ): Promise<TransactionPath> => {
    const transaction = createForwarderTransaction(forwarder, script)

    // Only apply pretransactions to the first transaction in the path
    // as it's the only one that will be executed by the user
    try {
      const forwardingFeePreTransactions = await buildForwardingFeePreTransactions(
        transaction,
        provider
      )
      // If that happens, we give up as we should've been able to perform the action with this
      // forwarding path
      return {
        transactions: [...forwardingFeePreTransactions, transaction],
        path: [transaction, ...path],
      }
    } catch (err) {
      return { path: [], transactions: [] }
    }
  }

  // Check if one of the forwarders that has permission to perform an action
  // with `sig` on `address` can forward for us directly
  for (const forwarder of forwardersWithPermission) {
    const script = encodeCallScript([directTransaction])
    if (await canForward(forwarder, sender, script, provider)) {
      return buildForwardingPath(
        forwarder,
        script,
        [directTransaction],
        provider
      )
    }
  }

  // Get a list of all forwarders (excluding the forwarders with direct permission)
  const filterForwarders = forwarders.filter(
    (forwarder) => !includesAddress(forwardersWithPermission, forwarder)
  )

  // Set up the path finding queue
  // The queue takes the form of Array<[Array<EthereumTransaction>, Array<String>]>
  // In other words: it is an array of tuples, where the first index of the tuple
  // is the current path and the second index of the tuple is the
  // queue (a list of unexplored forwarder addresses) for that path
  const queue: any = forwardersWithPermission.map((forwarderWithPermission) => {
    // TODO: Fix types (type queue = [DirectTransaction[], string[]][])
    return [
      [
        createForwarderTransaction(
          forwarderWithPermission,
          encodeCallScript([directTransaction])
        ),
        directTransaction,
      ],
      filterForwarders,
    ]
  })

  // Find the shortest path via a breadth-first search of forwarder paths.
  // We do a breadth-first instead of depth-first search because:
  //   - We assume that most forwarding paths will be quite short, so it should be faster
  //     to check in "stages" rather than exhaust single paths
  //   - We don't currently protect against cycles in the path, and so exhausting single
  //     paths can be wasteful if they result in dead ends
  // TODO: We should find and return multiple paths
  do {
    const [path, [forwarder, ...nextQueue]] = queue.shift()

    // Skip if no forwarder or the path is longer than 5
    if (!forwarder || path.length > 5) continue

    // Get the previous forwarder address
    const previousForwarder = path[0].to

    // Encode the previous transaction into an EVM callscript
    const script = encodeCallScript([path[0]])

    if (await canForward(previousForwarder, forwarder, script, provider)) {
      if (await canForward(forwarder, sender, script, provider)) {
        // The previous forwarder can forward a transaction for this forwarder,
        // and this forwarder can forward for our address, so we have found a path
        return buildForwardingPath(forwarder, script, path, provider)
      } else {
        // The previous forwarder can forward a transaction for this forwarder,
        // but this forwarder can not forward for our address, so we add it as a
        // possible path in the queue for later exploration.
        queue.push([
          [createForwarderTransaction(forwarder, script), ...path],
          // Avoid including the current forwarder as a candidate for the next step
          // in the path. Note that this is naive and may result in repeating cycles,
          // but the maximum path length would prevent against infinite loops
          forwarders.filter((nextForwarder) => nextForwarder !== forwarder),
        ])
      }
    }

    // We add the current path on the back of the queue again, but we shorten
    // the list of possible forwarders.
    queue.push([path, nextQueue])
  } while (queue.length)

  return { path: [], transactions: [] }
}

/**
 * Calculate the transaction path for a transaction to `destination`
 * that invokes `methodSignature` with `params`.
 *
 */
export async function calculateTransactionPath(
  sender: string,
  destinationApp: App,
  methodSignature: string,
  params: any[],
  apps: App[],
  provider: ethersProviders.Provider,
  finalForwarder?: string //Address of the final forwarder that can perfom the action. Needed for actions that aren't in the ACL but whose execution depends on other factors
): Promise<TransactionPath> {
  // The direct transaction we eventually want to perform
  const directTransaction = await createDirectTransactionForApp(
    sender,
    destinationApp,
    methodSignature,
    params
  )

  const finalForwarderProvided = finalForwarder
    ? ethersUtils.isAddress(finalForwarder)
    : false

  const method = findAppMethodFromSignature(destinationApp, methodSignature)
  if (!method) {
    throw new Error(
      `No method named ${methodSignature} on ${destinationApp.address}`
    )
  }
  // We can already assume the user is able to directly invoke the action if:
  //   - The method has no ACL requirements and no final forwarder was given, or
  //   - The final forwarder matches the sender
  if (
    (method?.roles.length === 0 && !finalForwarderProvided) ||
    (finalForwarder && addressesEqual(finalForwarder, sender))
  ) {
    try {
      return { path: [directTransaction], transactions: [directTransaction] }
    } catch (_) {
      // If the direct transaction fails, we give up as we should have been able to
      // perform the action directly
      return { path: [], transactions: [] }
    }
  }

  // Failing this, attempt transaction pathing algorithm with forwarders
  const forwarders = apps
    .filter((app) => app.isForwarder === true)
    .map((app) => app.address)

  let forwardersWithPermission: string[] = []
  if (finalForwarderProvided) {
    if (finalForwarder) {
      if (!includesAddress(forwarders, finalForwarder)) {
        // Final forwarder was given, but did not match any available forwarders, so no path
        // could be found
        return { path: [], transactions: [] }
      }

      // Only attempt to find path with declared final forwarder; assume the final forwarder
      // is able to invoke the action
      forwardersWithPermission = [finalForwarder]
    }
  } else {
    // Find entities with the required permissions
    const role = (await destinationApp.roles()).find(
      (role) => role.name === method.roles[0]
    )

    const allowedEntities =
      role?.permissions
        ?.filter((permission) => permission.allowed)
        .map((permission) => permission.granteeAddress) || []

    // No one has access, so of course we don't as well
    if (allowedEntities.length === 0) {
      return { path: [], transactions: [] }
    }

    // User may have permission; attempt direct transaction
    if (
      includesAddress(allowedEntities, sender) ||
      includesAddress(allowedEntities, ANY_ENTITY)
    ) {
      try {
        return { path: [directTransaction], transactions: [directTransaction] }
      } catch (_) {
        // Don't immediately fail as the permission could have parameters applied that
        // disallows the user from the current action and forces us to use the full
        // pathing algorithm
      }
    }

    // Find forwarders with permission to perform the action
    forwardersWithPermission = forwarders.filter((forwarder) =>
      includesAddress(allowedEntities, forwarder)
    )
  }

  return calculateForwardingPath(
    sender,
    directTransaction,
    forwardersWithPermission,
    forwarders,
    provider
  )
}
