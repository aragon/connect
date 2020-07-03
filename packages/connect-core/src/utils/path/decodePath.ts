import { isCallScript, decodeCallScript } from '../callScript'
import { isValidForwardCall, parseForwardCall } from '../forwarding'
import { Transaction } from '../transactions'

export interface TransactionWithChildren extends Transaction {
  children?: TransactionWithChildren[]
}

/**
 * Decodes an EVM callscript and returns the transaction path it describes.
 *
 * @return An array of Ethereum transactions that describe each step in the path
 */
export function decodeTransactionPath(
  script: string
): TransactionWithChildren[] {
  // In the future we may support more EVMScripts, but for now let's just assume we're only
  // dealing with call scripts
  if (!isCallScript(script)) {
    throw new Error(`Script could not be decoded: ${script}`)
  }

  const path = decodeCallScript(script)

  return path.reduce((decodeSegments, segment) => {
    const { data } = segment

    let children
    if (isValidForwardCall(data)) {
      const forwardedEvmScript = parseForwardCall(data)

      try {
        children = decodeTransactionPath(forwardedEvmScript)
        // eslint-disable-next-line no-empty
      } catch (err) {}
    }

    return decodeSegments.concat({ ...segment, children })
  }, [] as TransactionWithChildren[])
}
