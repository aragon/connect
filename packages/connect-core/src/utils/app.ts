import { utils as ethersUtils } from 'ethers'

import { Abi, AppMethod } from '../types'
import { ErrorInvalid } from '../errors'
import App from '../entities/App'

export const apmAppId = (appName: string): string =>
  ethersUtils.namehash(`${appName}.aragonpm.eth`)

function signatureFromAbi(signature: string, abi: Abi): string {
  if (signature === 'fallback') {
    return 'fallback()'
  }

  const matches = signature.match(/(.*)\((.*)\)/m)

  if (!matches) {
    throw new ErrorInvalid(`Abi has no method with signature: ${signature}`)
  }

  const name = matches[1]
  const params = matches[2].split(',')

  // If a single ABI node is found with function name and same number of parameters,
  // generate the signature from ABI. Otherwise, use the one from artifact.
  const functionAbis = abi
    .filter((node) => node.name === name)
    .filter((node) => node.inputs.length === params.length)

  if (functionAbis.length === 1) {
    return `${functionAbis[0].name}(${functionAbis[0].inputs
      .map((input) => input.type)
      .join(',')})`
  }

  return signature
}

function findAppMethod(
  app: App,
  methodTestFn: any,
  { allowDeprecated = true } = {}
): AppMethod | undefined {
  const { deprecatedFunctions, functions } = app.artifact || {}

  let method
  // First try to find the method in the current functions
  if (Array.isArray(functions)) {
    method = functions
      .map((f) => {
        return { ...f, sig: signatureFromAbi(f.sig, app.abi), params: [] }
      })
      .find(methodTestFn)
  }

  if (!method && allowDeprecated) {
    // The current functions didn't have it; try with each deprecated version's functions
    const deprecatedFunctionsFromVersions = Object.values(
      deprecatedFunctions || {}
    )
    if (deprecatedFunctionsFromVersions.every(Array.isArray)) {
      // Flatten all the deprecated functions and find the method
      method = deprecatedFunctionsFromVersions.flat().find(methodTestFn)
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
  app: App,
  data: string,
  { allowDeprecated = true } = {}
): AppMethod | undefined {
  const methodId = data.substring(0, 10)
  const appMethod = findAppMethod(
    app,
    (method: AppMethod) =>
      ethersUtils.id(method.sig).substring(0, 10) === methodId,
    { allowDeprecated }
  )

  // Decode method's parameters
  if (appMethod?.abi) {
    const inputTypes = appMethod.abi?.inputs.map(({ type }) => type)

    appMethod.params = [...ethersUtils.defaultAbiCoder.decode(inputTypes, `0x${data.slice(10)}`)]
  }

  return appMethod
}

/**
 * Find the method descriptor corresponding to an app's method signature.
 *
 * @param  {Object} app App
 * @param  {string} methodSignature Method signature to be called
 * @param  {Object} options Options
 * @param  {boolean} [options.allowDeprecated] Allow deprecated functions to be returned. Defaults to true.
 * @return {Object|void} Method with radspec notice and function signature, or undefined if none was found
 */
export function findAppMethodFromSignature(
  app: App,
  methodSignature: string,
  { allowDeprecated = true } = {}
): AppMethod | undefined {
  // Is the given method a full signature, e.g. 'foo(arg1,arg2,...)'
  const fullMethodSignature =
    Boolean(methodSignature) &&
    methodSignature.includes('(') &&
    methodSignature.includes(')')

  return findAppMethod(
    app,
    (method: AppMethod) => {
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
