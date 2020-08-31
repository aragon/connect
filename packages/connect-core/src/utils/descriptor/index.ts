import { ForwardingPathDescriptionTree, StepDescribed } from '../../types'

export default class ForwardingPathDescription {
  readonly describeSteps: StepDescribed[]

  constructor(describeSteps: StepDescribed[]) {
    this.describeSteps = describeSteps
  }

  // Return a tree that can get used to render the path.
  tree(): ForwardingPathDescriptionTree {
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
