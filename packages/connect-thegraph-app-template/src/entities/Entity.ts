import VotingConnectorTheGraph from "../connector";

export default class VotingEntity {
  protected _connector: VotingConnectorTheGraph

  constructor(connector: VotingConnectorTheGraph) {
    this._connector = connector
  }

  public toString(): string {
    const render = {}

    Object.getOwnPropertyNames(this)
      .filter(prop => !prop.includes('_'))
      .map(prop => (render as any)[prop] = (this as any)[prop])

    return JSON.stringify(render, null, 2)
  }
}