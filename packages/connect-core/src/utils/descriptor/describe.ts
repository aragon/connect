import { providers as ethersProviders } from 'ethers'

import App from '../../entities/App'
import Transaction from '../../entities/Transaction'
import {
  ForwardingPathDescription,
  ForwardingPathDescriptionTree,
} from '../../entities/ForwardingPath'
import {
  tryEvaluatingRadspec,
  postprocessRadspecDescription,
} from '../radspec/index'
import { AppOrAddress, PostProcessDescription } from '../../types'

type ForwardingPathDescriptionTreeEntry =
  | AppOrAddress
  | [AppOrAddress, ForwardingPathDescriptionTreeEntry[]]

export type ForwardingPathDescriptionTree = ForwardingPathDescriptionTreeEntry[]

export class ForwardingPathDescription {
  readonly apps: App[]
  readonly describeSteps: PostProcessDescription[]

  constructor(data: ForwardingPathDescriptionData) {
    this.apps = data.apps
    this.describeSteps = data.describeSteps
  }

  // Return a tree that can get used to render the path.
  tree(): ForwardingPathDescriptionTree {
    // TODO:
    return []
  }

  // Renders the forwarding path description as text
  toString(): string {
    return this.tree().toString()
  }

  // TBD: a utility that makes it easy to render the tree,
  // e.g. as a nested list in HTML or React.
  reduce(callback: Function): any {}
}

export async function describeStep(
  transaction: Transaction,
  apps: App[],
  provider: ethersProviders.Provider
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
  provider: ethersProviders.Provider
): Promise<ForwardingPathDescription> {
  const describeSteps = await Promise.all(
    path.map((step) => describeStep(step, apps, provider))
  )
  return new ForwardingPathDescription({ describeSteps, apps })
}


////
/**
 * Use radspec to create a human-readable description for each transaction in the given `path`
 *
 * @param  {Array<Object>} path
 * @return {Promise<Array<Object>>} The given `path`, with decorated with descriptions at each step
 */
async describeTransactionPath (path) {
  return Promise.all(path.map(async (step) => {
    let decoratedStep

    if (Array.isArray(step)) {
      // Intent basket with multiple transactions in a single callscript
      // First see if the step can be handled with a specialized descriptor
      try {
        decoratedStep = await tryDescribingUpgradeOrganizationBasket(step, this)
      } catch (err) { }

      // If the step wasn't handled, just individually describe each of the transactions
      return decoratedStep || this.describeTransactionPath(step)
    }

    // Single transaction step
    // First see if the step can be handled with a specialized descriptor
    try {
      decoratedStep = await tryDescribingUpdateAppIntent(step, this)
    } catch (err) { }

    // Finally, if the step wasn't handled yet, evaluate via radspec normally
    if (!decoratedStep) {
      try {
        decoratedStep = await tryEvaluatingRadspec(step, this)
      } catch (err) { }
    }

    // Annotate the description, if one was found
    if (decoratedStep) {
      if (decoratedStep.description) {
        try {
          const processed = await postprocessRadspecDescription(decoratedStep.description, this)
          decoratedStep.description = processed.description
          decoratedStep.annotatedDescription = processed.annotatedDescription
        } catch (err) { }
      }

      if (decoratedStep.children) {
        decoratedStep.children = await this.describeTransactionPath(decoratedStep.children)
      }
    }

    return decoratedStep || step
  }))
}
