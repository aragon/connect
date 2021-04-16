import { DeployDAO as DeployDAOEvent } from '../../../generated/DAOFactory/DAOFactory'
import * as aragon from '../aragon'

export function handleDeployDAO(event: DeployDAOEvent): void {
  aragon.processOrg(event.params.dao)
}
