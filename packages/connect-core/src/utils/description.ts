import { ethers } from 'ethers'

import { isCallScript, decodeCallScript } from './callScript'
import { isValidForwardCall, parseForwardCall } from './forwarding'
import App from '../entities/App'
import Transaction from '../entities/Transaction'
import {
  ForwardingPathDescription,
  ForwardingPathDescriptionTree,
} from '../entities/ForwardingPath'
import {
  tryEvaluatingRadspec,
  postprocessRadspecDescription,
} from './radspec/index'
import { PostProcessDescription } from '../types'

export async function describeStep(
  transaction: Transaction,
  apps: App[],
  provider: ethers.providers.Provider
): Promise<PostProcessDescription> {
  if (!transaction.to) {
    throw new Error(`Could not describe transaction: missing 'to'`)
  }
  if (!transaction.data) {
    throw new Error(`Could not describe transaction: missing 'data'`)
  }

  let description, annotatedDescription
  try {
    description = await tryEvaluatingRadspec(transaction, apps, provider)

    if (description) {
      const processed = await postprocessRadspecDescription(description, apps)
      annotatedDescription = processed.annotatedDescription
      description = processed.description
    }
  } catch (err) {
    throw new Error(`Could not describe transaction: ${err}`)
  }

  return {
    description,
    annotatedDescription,
  }
}

/**
 * Use radspec to create a human-readable description for each step in the given `path`
 *
 */
export async function describeForwardingPath(
  path: Transaction[],
  apps: App[],
  provider: ethers.providers.Provider
): Promise<ForwardingPathDescription> {
  const describeSteps = await Promise.all(
    path.map((step) => describeStep(step, apps, provider))
  )
  return new ForwardingPathDescription({ describeSteps, apps })
}

/**
 * Decodes an EVM callscript and returns the forwarding path it description.
 *
 * @return An array of Ethereum transactions that describe each step in the path
 */
export function decodeForwardingPath(
  script: string
): ForwardingPathDescriptionTree {
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
        children = decodeForwardingPath(forwardedEvmScript)
        // eslint-disable-next-line no-empty
      } catch (err) {}
    }

    return decodeSegments.concat({ ...segment, children })
  }, [] as ForwardingPathDescriptionTree)
}
