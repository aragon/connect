import { ethers } from 'ethers'

import { AppIntent } from '../types'
import App from '../entities/App'
import { TransactionRequestData } from '../transactions/TransactionRequest'
import {
  addressesEqual,
  includesAddress,
  isAddress,
  ANY_ENTITY,
} from '../utils/address'
import { canForward } from '../utils/canForward'
import { encodeCallScript } from '../utils/encodeCallScript'
import { isFullMethodSignature } from '../utils/isFullMethodSignature'
import {
  createDirectTransactionForApp,
  createForwarderTransactionBuilder,
  applyForwardingFeePretransaction,
  applyTransactionGas,
} from '../utils/transactions'

// type queue = [DirectTransaction[], string[]][]

function validateMethod(
  destination: string,
  methodSignature: string,
  destinationApp: App
): AppIntent {
  const methods = destinationApp.intents
  if (!methods) {
    throw new Error(`No functions specified in artifact for ${destination}`)
  }

  // Find the relevant method information
  const method = methods.find((method) =>
    isFullMethodSignature(methodSignature)
      ? method.sig === methodSignature
      : // If the full signature isn't given, just select the first overload declared
        method.sig.split('(')[0] === methodSignature
  )
  if (!method) {
    throw new Error(`No method named ${methodSignature} on ${destination}`)
  }

  return method
}

/**
 * Calculate the forwarding path for a transaction to `destination`
 * that invokes `directTransaction`.
 *
 * @param  {string} sender
 * @param  {string} destination
 * @param  {Object} directTransaction
 * @param  {string} [forwardersWithPermission]
 * @return {Array<Object>} An array of Ethereum transactions that describe each step in the path
 */
async function calculateForwardingPath(
  sender: string,
  destination: string,
  directTransaction: TransactionRequestData,
  forwardersWithPermission: string[],
  forwarders: string[],
  provider: ethers.providers.Provider
): Promise<TransactionRequestData[]> {
  // No forwarders can perform the requested action
  if (forwardersWithPermission.length === 0) {
    return []
  }

  // TODO: handle pretransactions specified in the intent
  // This is difficult to do generically, as some pretransactions
  // (e.g. token approvals) only work if they're for a specific target
  delete directTransaction.pretransaction

  const createForwarderTransaction = createForwarderTransactionBuilder(
    sender,
    directTransaction
  )

  // Check if one of the forwarders that has permission to perform an action
  // with `sig` on `address` can forward for us directly
  for (const forwarder of forwardersWithPermission) {
    const script = encodeCallScript([directTransaction])
    if (await canForward(forwarder, sender, script, provider)) {
      const transaction = createForwarderTransaction(forwarder, script)
      try {
        const transactionWithFee = await applyForwardingFeePretransaction(
          transaction,
          provider
        )
        // `applyTransactionGas` can throw if the transaction will fail
        // If that happens, we give up as we should've been able to perform the action with this
        // forwarder
        return [
          await applyTransactionGas(transactionWithFee, provider, true),
          directTransaction,
        ]
      } catch (err) {
        return []
      }
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
    // TODO: Fix types
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
  // TODO(onbjerg): Should we find and return multiple paths?
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
        const transaction = createForwarderTransaction(forwarder, script)

        // Only apply pretransactions and gas to the first transaction in the path
        // as it's the only one that will be executed by the user
        try {
          const transactionWithFee = await applyForwardingFeePretransaction(
            transaction,
            provider
          )
          // `applyTransactionGas` can throw if the transaction will fail
          // If that happens, we give up as we should've been able to perform the action with this
          // forwarding path
          return [
            await applyTransactionGas(transactionWithFee, provider, true),
            ...path,
          ]
        } catch (err) {
          return []
        }
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

  return []
}

/**
 * Calculate the transaction path for a transaction to `destination`
 * that invokes `methodSignature` with `params`.
 *
 */
export async function calculateTransactionPath(
  sender: string,
  destination: string,
  methodSignature: string,
  params: any[],
  apps: App[],
  provider: ethers.providers.Provider,
  finalForwarder?: string //Address of the final forwarder that can perfom the action. Needed for actions that aren't in the ACL but whose execution depends on other factors
): Promise<TransactionRequestData[]> {
  // Get the destination app
  const destinationApp = apps.find((app) => app.address == destination)
  if (!destinationApp) {
    throw new Error(
      `Transaction path destination (${destination}) is not an installed app`
    )
  }

  // Make sure the method signature is correct
  const method = validateMethod(destination, methodSignature, destinationApp)

  const finalForwarderProvided = finalForwarder
    ? isAddress(finalForwarder)
    : false
  const directTransaction = await createDirectTransactionForApp(
    sender,
    destinationApp,
    method.sig,
    params,
    provider
  )

  // We can already assume the user is able to directly invoke the action if:
  //   - The method has no ACL requirements and no final forwarder was given, or
  //   - The final forwarder matches the sender
  if (
    (method.roles.length === 0 && !finalForwarderProvided) ||
    (finalForwarder && addressesEqual(finalForwarder, sender))
  ) {
    try {
      // `applyTransactionGas` can throw if the transaction will fail
      return [await applyTransactionGas(directTransaction, provider)]
    } catch (_) {
      // If the direct transaction fails, we give up as we should have been able to
      // perform the action directly
      return []
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
        return []
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
      role?.grantees?.map((permission) => permission.granteeAddress) || []

    // No one has access, so of course we don't as well
    if (allowedEntities.length === 0) {
      return []
    }

    // User may have permission; attempt direct transaction
    if (
      includesAddress(allowedEntities, sender) ||
      includesAddress(allowedEntities, ANY_ENTITY)
    ) {
      try {
        // `applyTransactionGas` can throw if the transaction will fail
        return [await applyTransactionGas(directTransaction, provider)]
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
    destination,
    directTransaction,
    forwardersWithPermission,
    forwarders,
    provider
  )
}
