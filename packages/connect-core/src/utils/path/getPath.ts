/**
   * Calculate the transaction path for a transaction to `destination`
   * that invokes `methodSignature` with `params`.
   *
   * @param  {string} destination
   * @param  {string} methodSignature
   * @param  {Array<*>} params
   * @param  {string} [finalForwarder] Address of the final forwarder that can perfom the action
   * @return {Promise<Array<Object>>} An array of Ethereum transactions that describe each step in the path
   */
  async getTransactionPath (destination, methodSignature, params, finalForwarder) {
    const accounts = await this.getAccounts()

    for (let account of accounts) {
      const path = await this.calculateTransactionPath(
        account,
        destination,
        methodSignature,
        params,
        finalForwarder
      )

      if (path.length > 0) {
        try {
          return this.describeTransactionPath(path)
        } catch (_) {
          return path
        }
      }
    }

    return []
  }
