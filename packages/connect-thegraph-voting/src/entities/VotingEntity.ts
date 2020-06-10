import VotingConnectorTheGraph from "../connector";

export default class VotingEntity {
  protected _connector: VotingConnectorTheGraph

  constructor(connector: VotingConnectorTheGraph) {
    this._connector = connector
  }
}