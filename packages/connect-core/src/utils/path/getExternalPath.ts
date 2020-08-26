/**
 * Calculate the transaction path for a transaction to an external `destination`
 * (not the currently running app) that invokes a method matching the
 * `methodAbiFragment` with `params`.
 *
 * @param  {string} destination Address of the external contract
 * @param  {object} methodAbiFragment ABI fragment of method to invoke
 * @param  {Array<*>} params
 * @return {Promise<Array<Object>>} An array of Ethereum transactions that describe each step in the path.
 *   If the destination is a non-installed contract, always results in an array containing a
 *   single transaction.
 */
async getExternalTransactionPath (destination, methodAbiFragment, params) {
  if (addressesEqual(destination, this.aclProxy.address)) {
    try {
      return this.getACLTransactionPath(methodAbiFragment.name, params)
    } catch (_) {
      return []
    }
  }

  const installedApp = await this.getApp(destination)
  if (installedApp) {
    // Destination is an installed app; need to go through normal transaction pathing
    // TODO: use calculate transaction path
    return this.getTransactionPath(destination, methodAbiFragment.name, params)
  }

  // Destination is not an installed app on this org, just create a direct transaction
  // with the first account
  const account = (await this.getAccounts())[0]

  try {
    const tx = await createDirectTransaction(account, destination, methodAbiFragment, params, this.web3)
    return this.describeTransactionPath([tx])
  } catch (_) {
    return []
  }
}
