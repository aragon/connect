import { Network } from '@aragon/connect-types'
import { ConnectionContext } from '../types'
import App from '../entities/App'

type AppConnectContext = {
  app: App
  connector: string
  config: object
  ipfs: ConnectionContext['ipfs']
  network: Network
  verbose: boolean
}

function normalizeConnectorConfig<Config extends object>(
  connector: string | [string, Config | undefined]
): [string, Config] {
  if (Array.isArray(connector)) {
    // Returning `{} as Config` shouldn’t be an issue, because the config type
    // of an app connector should have all its properties declared as optional.
    return [connector[0], connector[1] ?? ({} as Config)]
  }
  if (typeof connector === 'string') {
    return [connector, {} as Config]
  }
  throw new Error('The connector should be passed as a string or an array.')
}

export function createAppConnector<
  ConnectedApp extends object,
  Config extends object
>(
  callback: (
    context: { config: Config } & AppConnectContext
  ) => ConnectedApp | Promise<ConnectedApp>
) {
  return async function connect(
    app: App | Promise<App>,
    connector?: string | [string, Config | undefined]
  ): Promise<App & ConnectedApp> {
    app = await app

    if (!(app instanceof App)) {
      throw new Error(`App connector: the passed value is not an App.`)
    }

    const { connection } = app.organization
    const { orgConnector } = connection
    const [connectorName, connectorConfig] = normalizeConnectorConfig<Config>(
      connector || orgConnector.name
    )

    const connectedApp = await callback({
      app,
      config: connectorConfig,
      connector: connectorName,
      ipfs: connection.ipfs,
      network: orgConnector.network,
      verbose: connection.verbose,
    })

    return Object.assign(connectedApp, app)
  }
}
