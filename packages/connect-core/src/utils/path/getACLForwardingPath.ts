import { Address } from '@aragon/connect-types'
import { providers as ethersProviders } from 'ethers'

import { getForwardingPath } from './getForwardingPath'
import { findMethodAbiFragment } from '../abi'
import { findAppMethodFromSignature } from '../app'
import App from '../../entities/App'
import ForwardingPath from '../../entities/ForwardingPath'

/**
 * Get the permission manager for an `app`'s and `role`.
 *
 * @param {string} appAddress
 * @param {string} roleHash
 * @return {Promise<string>} The permission manager
 */
async function getPermissionManager(
  appAddress: Address,
  roleHash: string,
  installedApps: App[]
) {
  const app = installedApps.find((app) => app.address === appAddress)
  const roles = await app?.roles()

  return roles?.find((role) => role.hash === roleHash)?.manager
}

/**
 * Calculates transaction path for performing a method on the ACL
 *
 * @param {string} methodSignature
 * @param {Array<*>} params
 * @return {Promise<Array<Object>>} An array of Ethereum transactions that describe each step in the path
 */
export async function getACLForwardingPath(
  sender: Address,
  acl: App,
  methodSignature: string,
  params: any[],
  installedApps: App[],
  provider: ethersProviders.Provider
): Promise<ForwardingPath> {
  const method = findAppMethodFromSignature(acl, methodSignature, {
    allowDeprecated: false,
  })
  if (!method) {
    throw new Error(`No method named ${methodSignature} on ACL`)
  }

  if (method.roles && method.roles.length !== 0) {
    // This action can be done with regular transaction pathing (it's protected by an ACL role)
    return getForwardingPath(
      sender,
      acl,
      methodSignature,
      params,
      installedApps,
      provider
    )
  } else {
    // Some ACL functions don't have a role and are instead protected by a manager
    // Inspect the matched method's ABI to find the position of the 'app' and 'role' parameters
    // needed to get the permission manager
    const methodAbiFragment = findMethodAbiFragment(acl.abi, methodSignature)
    if (!methodAbiFragment) {
      throw new Error(`Method ${method} not found on ACL ABI`)
    }

    const inputNames = methodAbiFragment.inputs.map((input) => input.name)
    const appIndex = inputNames.indexOf('_app')
    const roleIndex = inputNames.indexOf('_role')

    if (appIndex === -1 || roleIndex === -1) {
      throw new Error(
        `Method ${methodSignature} doesn't take _app and _role as input. Permission manager cannot be found.`
      )
    }

    const manager = await getPermissionManager(
      params[appIndex],
      params[roleIndex],
      installedApps
    )

    return getForwardingPath(
      sender,
      acl,
      methodSignature,
      params,
      installedApps,
      provider,
      manager
    )
  }
}
