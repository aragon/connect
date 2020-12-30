import { AppOrAddress, StepDescribed } from '../../types'
import App from '../../entities/App'

type ForwardingPathDescriptionTreeEntry =
  | AppOrAddress
  | [AppOrAddress, ForwardingPathDescriptionTreeEntry[]]

type ForwardingPathDescriptionTree = ForwardingPathDescriptionTreeEntry[]

export default class ForwardingPathDescription {
  #installedApps: App[]
  readonly describedSteps: StepDescribed[]

  constructor(describedSteps: StepDescribed[], installedApps: App[]) {
    this.#installedApps = installedApps
    this.describedSteps = describedSteps
  }

  // Return a tree that can get used to render the path.
  tree(): ForwardingPathDescriptionTree {
    const docoratedStep = this.describedSteps.map(async (step) => {
      const app = this.#installedApps.find((app) => app.address === step.to)

      if (app) {
        return {
          ...step,
          app,
        }
      }
    })
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

export { describePath, describeTransaction } from './describe'
export { decodeForwardingPath } from './decode'
