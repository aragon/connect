import { utils as ethersUtils } from 'ethers'

import { AppMethod } from '../types'
import App from '../entities/App'
import Transaction from '../entities/Transaction'

export const apmAppId = (appName: string): string =>
  ethersUtils.namehash(`${appName}.aragonpm.eth`)

// Is the given method a full signature, e.g. 'foo(arg1,arg2,...)'
export const isFullMethodSignature = (methodSignature: string): boolean => {
  return (
    Boolean(methodSignature) &&
    methodSignature.includes('(') &&
    methodSignature.includes(')')
  )
}

export function getAppMethod(
  destinationApp: App,
  methodSignature: string
): AppMethod {
  const methods = destinationApp.methods
  if (!methods) {
    throw new Error(
      `No methods specified in the app for ${destinationApp.address}. Make sure the metada for the app is available`
    )
  }

  // Find the relevant method information
  const method = methods.find((method) =>
    isFullMethodSignature(methodSignature)
      ? method.sig === methodSignature
      : // If the full signature isn't given, just select the first overload declared
        method.sig.split('(')[0] === methodSignature
  )

  if (!method) {
    throw new Error(
      `No method named ${methodSignature} on ${destinationApp.address}`
    )
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
  transaction: Transaction
): AppMethod | undefined {
  const methodId = transaction.data.substring(0, 10)

  const checkMethodSignature = (siganture: string): boolean => {
    // Hash signature with Ethereum Identity and silce bytes
    const sigHash = ethersUtils.hexDataSlice(ethersUtils.id(siganture), 0, 4)
    return sigHash === methodId
  }

  const { deprecatedMethods, methods } = app || {}

  let method
  // First try to find the method in the current functions
  if (Array.isArray(methods)) {
    method = methods.find((method) => checkMethodSignature(method.sig))
  }

  if (!method) {
    // The current functions didn't have it; try with each deprecated version's functions
    const deprecatedFunctionsFromVersions = Object.values(
      deprecatedMethods || {}
    )
    if (deprecatedFunctionsFromVersions.every(Array.isArray)) {
      // Flatten all the deprecated functions
      const allDeprecatedFunctions = ([] as AppMethod[]).concat(
        ...deprecatedFunctionsFromVersions
      )
      method = allDeprecatedFunctions.find((method) =>
        checkMethodSignature(method.sig)
      )
    }
  }

  return method
}

/////

function findAppMethod(app, methodTestFn, { allowDeprecated } = {}) {
  const { deprecatedFunctions, functions } = app || {}

  let method
  // First try to find the method in the current functions
  if (Array.isArray(functions)) {
    method = functions.find(methodTestFn)
  }

  if (!method && allowDeprecated) {
    // The current functions didn't have it; try with each deprecated version's functions
    const deprecatedFunctionsFromVersions = Object.values(
      deprecatedFunctions || {}
    )
    if (deprecatedFunctionsFromVersions.every(Array.isArray)) {
      // Flatten all the deprecated functions
      const allDeprecatedFunctions = [].concat(
        ...deprecatedFunctionsFromVersions
      )
      method = allDeprecatedFunctions.find(methodTestFn)
    }
  }

  return method
}

/**
 * Find the method descriptor corresponding to the data component of a
 * transaction sent to `app`.
 *
 * @param  {Object} app App artifact
 * @param  {Object} data Data component of a transaction to app
 * @param  {Object} options Options
 * @param  {boolean} [options.allowDeprecated] Allow deprecated functions to be returned. Defaults to true.
 * @return {Object|void} Method with radspec notice and function signature, or undefined if none was found
 */
export function findAppMethodFromData(
  app,
  data,
  { allowDeprecated = true } = {}
) {
  const methodId = data.substring(2, 10)
  return findAppMethod(
    app,
    (method) => soliditySha3(method.sig).substring(2, 10) === methodId,
    { allowDeprecated }
  )
}

/**
 * Find the method descriptor corresponding to an app's method signature.
 *
 * @param  {Object} app App artifact
 * @param  {string} methodSignature Method signature to be called
 * @param  {Object} options Options
 * @param  {boolean} [options.allowDeprecated] Allow deprecated functions to be returned. Defaults to true.
 * @return {Object|void} Method with radspec notice and function signature, or undefined if none was found
 */
export function findAppMethodFromSignature(
  app,
  methodSignature,
  { allowDeprecated = true } = {}
) {
  // Is the given method a full signature, e.g. 'foo(arg1,arg2,...)'
  const fullMethodSignature =
    Boolean(methodSignature) &&
    methodSignature.includes('(') &&
    methodSignature.includes(')')

  return findAppMethod(
    app,
    (method) => {
      // Note that fallback functions have the signature 'fallback' in an app's artifact.json
      if (fullMethodSignature) {
        return method.sig === methodSignature
      }

      // If full signature isn't given, just match against the method names
      const methodName = method.sig.split('(')[0]
      return methodName === methodSignature
    },
    { allowDeprecated }
  )
}
