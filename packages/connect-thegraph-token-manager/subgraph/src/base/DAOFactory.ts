import { DeployDAO as DeployDAOEvent } from '../../generated/DAOFactory/DAOFactory'
import { Kernel as KernelTemplate } from '../../generated/templates'

export function handleDeployDAO(event: DeployDAOEvent): void {
  let orgAddress = event.params.dao

  KernelTemplate.create(orgAddress)
}
