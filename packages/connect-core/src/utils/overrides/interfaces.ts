import { apmAppId } from '../app'

// ABIs
import abiAragonACL from './abi/ACL.json'
import abiAragonKernel from './abi/Kernel.json'
import abiAragonEVMScriptRegistry from './abi/EVMScriptRegistry.json'
import abiApmRegistry from './abi/APMRegistry.json'
import abiApmRepo from './abi/Repo.json'
import abiApmEnsSubdomainRegistrar from './abi/ENSSubdomainRegistrar.json'

// Artifacts
import artifactsAragonACL from './artifacts/aragon/ACL.json'
import artifactsAragonKernel from './artifacts/aragon/Kernel.json'
import artifactsAragonEVMScriptRegistry from './artifacts/aragon/EVMScriptRegistry.json'
import artifactsApmRegistry from './artifacts/apm/APMRegistry.json'
import artifactsApmRepo from './artifacts/apm/Repo.json'
import artifactsApmEnsSubdomainRegistrar from './artifacts/apm/ENSSubdomainRegistrar.json'
import { Abi } from '../../types'

const ABIS: { [key: string]: any[] } = {
  'aragon/ACL': abiAragonACL.abi,
  'aragon/Kernel': abiAragonKernel.abi,
  'aragon/EVM Script Registry': abiAragonEVMScriptRegistry.abi,
  'apm/APM Registry': abiApmRegistry.abi,
  'apm/Repo': abiApmRepo.abi,
  'apm/ENS Subdomain Registrar': abiApmEnsSubdomainRegistrar.abi,
}

const ARTIFACTS: { [key: string]: any } = {
  'aragon/ACL': artifactsAragonACL,
  'aragon/Kernel': artifactsAragonKernel,
  'aragon/EVM Script Registry': artifactsAragonEVMScriptRegistry,
  'apm/APM Registry': artifactsApmRegistry,
  'apm/Repo': artifactsApmRepo,
  'apm/ENS Subdomain Registrar': artifactsApmEnsSubdomainRegistrar,
}

const SYSTEM_APP_MAPPINGS = new Map([
  [apmAppId('acl'), 'ACL'],
  [apmAppId('evmreg'), 'EVM Script Registry'],
  [apmAppId('kernel'), 'Kernel'],
])

const APM_APP_MAPPINGS = new Map([
  [apmAppId('apm-registry'), 'APM Registry'],
  [apmAppId('apm-repo'), 'Repo'],
  [apmAppId('apm-enssub'), 'ENS Subdomain Registrar'],
  // Support open.aragonpm.eth's native packages
  // Note that these were erroneously deployed on the open.aragonpm.eth instance rather than
  // reusing the aragonpm.eth versions
  [apmAppId('apm-registry.open'), 'APM Registry'],
  [apmAppId('apm-repo.open'), 'Repo'],
  [apmAppId('apm-enssub.open'), 'ENS Subdomain Registrar'],
  // Support hatch.aragonpm.eth's native packages (see note above for `open.aragonpm.eth`)
  [apmAppId('apm-registry.hatch'), 'APM Registry'],
  [apmAppId('apm-repo.hatch'), 'Repo'],
  [apmAppId('apm-enssub.hatch'), 'ENS Subdomain Registrar'],
])

const APP_NAMESPACE_MAPPINGS = new Map([
  ['aragon', SYSTEM_APP_MAPPINGS],
  ['apm', APM_APP_MAPPINGS],
])

export const getAbi = (name: string): Abi => ABIS[name] || null
export const getArtifact = (name: string): any => ARTIFACTS[name] || null

export function getAppInfo(appId: string, namespace: string): any {
  const nameMapping = APP_NAMESPACE_MAPPINGS.get(namespace)

  if (!nameMapping || !nameMapping.has(appId)) {
    return null
  }

  const appName = nameMapping.get(appId)
  const app = `${namespace}/${appName}`
  const abi = getAbi(app)
  const artifact = getArtifact(app)

  return {
    abi,
    appName,
    ...artifact,
  }
}

export function hasAppInfo(appId: string, namespace: string): boolean {
  const mapping = APP_NAMESPACE_MAPPINGS.get(namespace)
  if (mapping) return Boolean(mapping) && mapping.has(appId)
  return false
}
