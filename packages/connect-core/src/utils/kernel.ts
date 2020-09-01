import { utils as ethersUtils } from 'ethers'

import { addressesEqual } from './address'
import { findAppMethodFromData } from './app'
import { StepDecoded } from '../types'
import App from '../entities/App'

const CORE_NAMESPACE = ethersUtils.solidityKeccak256(['string'], ['core'])
const APP_ADDR_NAMESPACE = ethersUtils.solidityKeccak256(['string'], ['app'])
const APP_BASES_NAMESPACE = ethersUtils.solidityKeccak256(['string'], ['base'])

const KERNEL_NAMESPACES_NAMES = new Map([
  [CORE_NAMESPACE, 'Core'],
  [APP_ADDR_NAMESPACE, 'Default apps'],
  [APP_BASES_NAMESPACE, 'App code'],
])

const SET_APP_ABI = [
  { name: 'namespace', type: 'bytes32' },
  { name: 'appId', type: 'bytes32' },
  { name: 'appAddress', type: 'address' },
].map((param) => ethersUtils.ParamType.from(param))

interface KernelNamespace {
  name: string
  hash: string
}

export function getKernelNamespace(hash: string): KernelNamespace | null {
  return KERNEL_NAMESPACES_NAMES.has(hash)
    ? { name: KERNEL_NAMESPACES_NAMES.get(hash) as string, hash }
    : null
}

/**
 * Decode `Kernel.setApp()` parameters based on transaction data.
 *
 * @param  {Object} data Transaction data
 * @return {Object} Decoded parameters for `setApp()` (namespace, appId, appAddress)
 */
export function decodeKernelSetAppParameters(data: string): ethersUtils.Result {
  // Strip 0x prefix + bytes4 sig to get parameter data
  const paramData = data.substring(10)
  return ethersUtils.defaultAbiCoder.decode(SET_APP_ABI, paramData)
}

export function isKernelAppCodeNamespace(namespaceHash: string): boolean {
  return namespaceHash === APP_BASES_NAMESPACE
}

/**
 * Is the transaction intent for `Kernel.setApp()`?
 *
 * @param  {Object} kernelApp App artifact for Kernel
 * @param  {Object} intent Transaction intent
 * @return {Boolean} Whether the intent is `Kernel.setApp()`
 */
export function isKernelSetAppIntent(
  kernelApp: App,
  intent: StepDecoded
): boolean {
  if (!addressesEqual(kernelApp.address, intent.to)) return false

  const method = findAppMethodFromData(kernelApp, intent.data)
  return !!method && method.sig === 'setApp(bytes32,bytes32,address)'
}
