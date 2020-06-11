import { ethers } from 'ethers'

const CORE_NAMESPACE = ethers.utils.solidityKeccak256(['string'], ['core'])
const APP_ADDR_NAMESPACE = ethers.utils.solidityKeccak256(['string'], ['app'])
const APP_BASES_NAMESPACE = ethers.utils.solidityKeccak256(['string'], ['base'])

const KERNEL_NAMESPACES_NAMES = new Map([
  [CORE_NAMESPACE, 'Core'],
  [APP_ADDR_NAMESPACE, 'Default apps'],
  [APP_BASES_NAMESPACE, 'App code'],
])

interface KernelNamespace {
  name: string
  hash: string
}

export function getKernelNamespace(hash: string): KernelNamespace | null {
  return KERNEL_NAMESPACES_NAMES.has(hash)
    ? { name: KERNEL_NAMESPACES_NAMES.get(hash) as string, hash }
    : null
}
