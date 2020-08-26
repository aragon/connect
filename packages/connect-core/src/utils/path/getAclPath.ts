/**
   * Get the permission manager for an `app`'s and `role`.
   *
   * @param {string} appAddress
   * @param {string} roleHash
   * @return {Promise<string>} The permission manager
   */
  async getPermissionManager (appAddress, roleHash) {
    const permissions = await this.permissions.pipe(first()).toPromise()
    const appPermissions = permissions[appAddress]

    return dotprop.get(appPermissions, `${roleHash}.manager`)
  }


/**
 * Calculates transaction path for performing a method on the ACL
 *
 * @param {string} methodSignature
 * @param {Array<*>} params
 * @return {Promise<Array<Object>>} An array of Ethereum transactions that describe each step in the path
 */
async getACLTransactionPath (methodSignature, params) {
  const aclAddr = this.aclProxy.address
  const acl = await this.getApp(aclAddr)

  const method = findAppMethodFromSignature(acl, methodSignature, { allowDeprecated: false })
  if (!method) {
    throw new Error(`No method named ${methodSignature} on ACL`)
  }

  if (method.roles && method.roles.length !== 0) {
    // This action can be done with regular transaction pathing (it's protected by an ACL role)
    // TODO: use calculate transaction path
    return this.getTransactionPath(aclAddr, methodSignature, params)
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
      throw new Error(`Method ${methodSignature} doesn't take _app and _role as input. Permission manager cannot be found.`)
    }

    const manager = await this.getPermissionManager(params[appIndex], params[roleIndex])

    // TODO: use calculate transaction path
    return this.getTransactionPath(aclAddr, methodSignature, params, manager)
  }
}
