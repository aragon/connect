import { ethers } from 'ethers'

import { AppIntent, TransactionRequestData } from '../types'
import App from '../entities/App'

export const apmAppId = (appName: string): string =>
  ethers.utils.namehash(`${appName}.aragonpm.eth`)

// Is the given method a full signature, e.g. 'foo(arg1,arg2,...)'
export const isFullMethodSignature = (methodSignature: string): boolean => {
  return (
    Boolean(methodSignature) &&
    methodSignature.includes('(') &&
    methodSignature.includes(')')
  )
}

export function validateMethod(
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
 * Find the method descriptor corresponding to the data component of a
 * transaction sent to `app`.
 *
 * @param  {Object} app App artifact
 * @param  {Object} data Data component of a transaction to app
 * @return {Object|void} Method with radspec notice and function signature, or undefined if none was found
 */
export function findAppMethodFromIntent(
  app: App,
  transaction: TransactionRequestData
): AppIntent | undefined {
  const methodId = transaction.data.substring(0, 10)

  const checkMethodSignature = (siganture: string): boolean => {
    // Hash signature with Ethereum Identity and silce bytes
    const sigHash = ethers.utils.hexDataSlice(ethers.utils.id(siganture), 0, 4)
    return sigHash === methodId
  }

  const { deprecatedIntents, intents } = app || {}

  let method
  // First try to find the method in the current functions
  if (Array.isArray(intents)) {
    method = intents.find((method) => checkMethodSignature(method.sig))
  }

  if (!method) {
    // The current functions didn't have it; try with each deprecated version's functions
    const deprecatedFunctionsFromVersions = Object.values(
      deprecatedIntents || {}
    )
    if (deprecatedFunctionsFromVersions.every(Array.isArray)) {
      // Flatten all the deprecated functions
      const allDeprecatedFunctions = ([] as AppIntent[]).concat(
        ...deprecatedFunctionsFromVersions
      )
      method = allDeprecatedFunctions.find((method) =>
        checkMethodSignature(method.sig)
      )
    }
  }

  return method
}
