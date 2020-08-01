import { DeployDAO as DeployDAOEvent } from '../../../generated/DAOFactory@0.6/DAOFactory'
import * as aragon from '../aragon'

export function handleDeployDAO(event: DeployDAOEvent): void {
  aragon.processOrg(event.params.dao)
}
