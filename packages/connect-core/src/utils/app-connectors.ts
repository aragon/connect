import type {
  Network,
  SubscriptionCallback,
  SubscriptionHandler,
  SubscriptionResult,
  SubscriptionStart,
} from '@1hive/connect-types'
import {
  isSubscriptionHandler,
  isSubscriptionStart,
  ConnectionContext,
} from '../types'

import { ErrorInvalidConnector, ErrorInvalidApp } from '../errors'
import App from '../entities/App'

type AppConnectContext = {
  app: App
  config: object
  connector: string
  ipfs: ConnectionContext['ipfs']
  network: Network
  orgConnector: ConnectionContext['orgConnector']
  verbose: boolean
}

type AugmentedApp<T> = App &
  T & {
    _app: App
    _connectedApp: T
  }

type ConnectorDeclaration<Config> =
  | string
  | [string, Config | undefined]
  | undefined

type CreateAppConnectorCallback<ConnectedApp, Config> = (
  context: { config: Config } & AppConnectContext
) => ConnectedApp | Promise<ConnectedApp>

function normalizeConnectorConfig<Config extends object>(
  connector: ConnectorDeclaration<Config>
): [string, Config] {
  if (Array.isArray(connector)) {
    // Returning `{} as Config` shouldn’t be an issue, because the config type
    // of an app connector should have all its properties declared as optional.
    return [connector[0], connector[1] ?? ({} as Config)]
  }
  if (typeof connector === 'string') {
    return [connector, {} as Config]
  }
  throw new ErrorInvalidConnector(
    'The connector should be passed as a string or an array.'
  )
}

// Check if an app is valid. We are not using instanceof here, because the
// passed app might come from the final app dependency, while @connect-core
// might come from the app connector they are using, with two different
// versions. It also makes it easier to work with linked dependencies, as it
// creates the same kind of issues.
function isApp(app: unknown): app is App {
  return (
    typeof app === 'object' &&
    'name' in (app as object) &&
    'address' in (app as object) &&
    'appId' in (app as object) &&
    'version' in (app as object)
  )
}

async function getProxiedApp<
  ConnectedApp extends object,
  Config extends object
>(
  app: App | Promise<App> | undefined,
  connector: ConnectorDeclaration<Config>,
  callback: CreateAppConnectorCallback<ConnectedApp, Config>
): Promise<AugmentedApp<ConnectedApp>> {
  app = (await app) as App

  if (!isApp(app)) {
    throw new ErrorInvalidApp(
      `App connector: the passed value doesn’t appear to be an App.`
    )
  }

  const { connection } = app.organization
  const { orgConnector } = connection

  // App connector config.
  const [connectorName, connectorConfig] = normalizeConnectorConfig<Config>(
    // Contrary to the main connect() function, app connectors don’t require
    // the connector to be passed. In this case, the name of the org
    // connector (e.g. `name`) is used instead.
    connector || orgConnector.name
  )

  const connectedApp = await callback({
    app,
    config: connectorConfig,
    connector: connectorName,
    ipfs: connection.ipfs,
    network: orgConnector.network,
    orgConnector,
    verbose: connection.verbose,
  })

  const boundMethods = new WeakMap()

  const proxiedApp = new Proxy(connectedApp, {
    get: (target: ConnectedApp, key: string | symbol) => {
      const isAppProperty =
        (connectedApp as any)[key as keyof ConnectedApp] === undefined

      // Pick properties from ConnectedApp first, then App
      const instance = (isAppProperty ? app : connectedApp) as any

      // Bind methods as they get accessed (so `this` works as expected).
      // This is done once for reference comparisons to work as expected.
      if (
        typeof instance[key] === 'function' &&
        !boundMethods.has(instance[key])
      ) {
        instance[key] = instance[key].bind(instance)
        boundMethods.set(instance[key], true)
      }

      return instance[key]
    },
  }) as AugmentedApp<ConnectedApp>

  // Useful for inspection
  proxiedApp._app = app
  proxiedApp._connectedApp = connectedApp

  return proxiedApp
}

export function createAppConnector<
  ConnectedApp extends object,
  Config extends object
>(callback: CreateAppConnectorCallback<ConnectedApp, Config>) {
  return function connect(
    appOrSubscribe: App | Promise<App> | SubscriptionResult<App>,
    connector?: ConnectorDeclaration<Config>
  ):
    | Promise<AugmentedApp<ConnectedApp>>
    | SubscriptionStart<AugmentedApp<ConnectedApp>> {
    // If app is a SubscriptionStart, assume it is onApp():
    // start listening, and return the handler.
    if (isSubscriptionStart(appOrSubscribe)) {
      return (
        subscriptionCb: SubscriptionCallback<AugmentedApp<ConnectedApp>>
      ): SubscriptionHandler => {
        let cancelled = false

        const subscriptionHandler = appOrSubscribe(
          (error: Error | null, app?: App) => {
            if (error !== null) {
              subscriptionCb(error)
              return
            }
            getProxiedApp<ConnectedApp, Config>(app, connector, callback)
              .then((app) => {
                if (cancelled) {
                  return
                }
                subscriptionCb(null, app)
              })
              .catch((err) => {
                if (!cancelled) {
                  subscriptionCb(err)
                }
              })
          }
        )

        return {
          unsubscribe() {
            cancelled = true
            subscriptionHandler.unsubscribe()
          },
        }
      }
    }

    if (isSubscriptionHandler(appOrSubscribe)) {
      throw new ErrorInvalidApp(
        `App connector: the value doesn’t appear to be an App or an app subscription.`
      )
    }

    return getProxiedApp<ConnectedApp, Config>(
      appOrSubscribe,
      connector,
      callback
    )
  }
}
