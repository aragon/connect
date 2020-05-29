import TokenManagerConnectorTheGraph from "../connector";

export default class Entity {
  protected _connector: TokenManagerConnectorTheGraph

  constructor(connector: TokenManagerConnectorTheGraph) {
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