# Organization

An `Organization` instance represents an Aragon organization and allows to interact with it.

## Methods

### Organization\#apps\(\)

Fetch the apps installed in the organization.

| Name | Type | Description |
| :--- | :--- | :--- |
| returns | `Promise<App[]>` | A promise resolving to the current list of apps. |

### Organization\#app\(appAddress\)

Fetch a specific app in the organization.

| Name | Type | Description |
| :--- | :--- | :--- |
| `appAddress` | `String` | The address of an app instance. |
| returns | `Promise<App>` | A promise resolving to an app. |

### Organization\#addApp\(repoName, options\)

Install a new app into the organization from a given [aragonPM repository](https://hack.aragon.org/docs/apm-intro).

| Name | Type | Description |
| :--- | :--- | :--- |
| `repoName` | `String` | Repository name \(e.g. `voting.aragonpm.eth`\). |
| `options` | `Object` | Options object. |
| `options.initFuncName` | `String` | Name of the function that gets called to initialize the app. Set to `none` to skip. Defaults to `initialize`. |
| `options.initFuncArgs` | `Array<String>` | Arguments passed to the function set as `options.initFuncName`. Defaults to `[]`. |
| `options.openPermissions` | `Boolean` | Whether to set the permissions open on the app. Defaults to `false`. |
| returns | `Promise<TransactionIntent>` | A promise resolving to an `TransactionIntent` instance. |

### Organization\#removeApp\(appAddress\)

Remove an app from the organization.

| Name | Type | Description |
| :--- | :--- | :--- |
| `appAddress` | `String` | Address of the app instance. |
| returns | `Promise<TransactionIntent>` | A promise resolving to an `TransactionIntent` instance. |

### Organization\#permissions\(\)

Fetch the organization’s permissions.

| Name | Type | Description |
| :--- | :--- | :--- |
| returns | `Promise<Permissions>` | A promise resolving to a `Permissions`. |

### Organization\#addPermission\(address, appAddress, roleId\)

Add a new permission.

| Name | Type | Description |
| :--- | :--- | :--- |
| `address` | `String` | The entity being granted the permission to. |
| `appAddress` | `String` | Address of the app instance. |
| `roleId` | `String` | The role identifier. |
| returns | `Promise<TransactionIntent>` | A promise resolving to an `TransactionIntent` instance. |

### Organization\#removePermission\(address, appAddress, roleId\)

Remove a specific permission.

| Name | Type | Description |
| :--- | :--- | :--- |
| `address` | `String` | The entity being granted the permission to. |
| `appAddress` | `String` | Address of the app instance. |
| `roleId` | `String` | The role identifier. |
| returns | `Promise<TransactionIntent>` | A promise resolving to an `TransactionIntent` instance. |

### Organization\#roleManager\(appAddress, roleId\)

Get the current manager of a role.

| Name | Type | Description |
| :--- | :--- | :--- |
| `appAddress` | `String` | Address of the app instance. |
| `roleId` | `String` | The role identifier. |
| returns | `Promise<String>` | The address of the role manager. |

### Organization\#setRoleManager\(address, appAddress, roleId\)

Set the manager of a role.

| Name | Type | Description |
| :--- | :--- | :--- |
| `address` | `String` | The entity to set as a role manager. Pass `null` to remove. |
| `appAddress` | `String` | Address of the app instance. |
| `roleId` | `String` | The role identifier. |
| returns | `Promise<TransactionIntent>` | A promise resolving to an `TransactionIntent` instance. |

### Organization\#appIntent\(appAddress, funcName, funcArgs\)

Execute a function on a given app.

| Name | Type | Description |
| :--- | :--- | :--- |
| `appAddress` | `String` | Address of the app instance. |
| `funcName` | `String` | Name of the function to call. |
| `funcArgs` | `String` | Parameters to pass to the function. |
| returns | `Promise<TransactionIntent>` | A promise resolving to an `TransactionIntent` instance. |

### Organization\#appCall\(appAddress, methodName, args\)

Performs a read-only call on the app contract.

| Name | Type | Description |
| :--- | :--- | :--- |
| `appAddress` | `String` | Address of the app instance. |
| `funcName` | `String` | Name of the function to call. |
| `funcArgs` | `String` | Parameters to pass to the function. |
| returns | `Promise<any>` | A promise resolving to the value being accessed. |

### Organization\#appState\(appAddress\)

Get the current state of an app.

| Name | Type | Description |
| :--- | :--- | :--- |
| `appAddress` | `String` | Address of the app instance. |
| returns | `Promise<Object>` | A promise resolving to the current app state as defined by the connector. |

### Organization\#on\(event, params, callback\)

Attach a listener to a specific event name.

| Name | Type | Description |
| :--- | :--- | :--- |
| `event` | `String` | The event name. |
| `params` | `Object` | Params specific to the event. This parameter is optional. |
| `callback` | `Function` | The function that gets called when the event fires. |
| returns | `Function` | A function that can get called to cancel the event. |

### Organization\#off\(event, callback\)

Remove a specific event listener.

| Name | Type | Description |
| :--- | :--- | :--- |
| `event` | `String` | The event name. |
| `callback` | `Function` | The function that gets called when the event fires. |

### Organization\#off\(event\)

Remove all the listeners of a given event.

| Name | Type | Description |
| :--- | :--- | :--- |
| `event` | `String` | The event name. |

### Organization\#off\(\)

Remove all the listeners on the organization.

## Events

### app

Start receiving a specific app. Gets called every time the app updates.

#### Listener params

| Name | Type | Description |
| :--- | :--- | :--- |
| `appAddress` | `String` | The app address to receive. |

#### Callback params

| Name | Type | Description |
| :--- | :--- | :--- |
| `app` | `App` | The app that is being listened to. |

### apps

Start receiving an array of the installed apps. Gets called every time a change happens in one of the apps.

#### Listener params

| Name | Type | Description |
| :--- | :--- | :--- |
| `appAddresses` | `Array<String>` | The app addresses to receive updates for. |

#### Callback params

| Name | Type | Description |
| :--- | :--- | :--- |
| `apps` | `Array<App>` | The apps that are being listened to. |

### appEvent

Start receiving the events of an app.

#### Listener params

| Name | Type | Description |
| :--- | :--- | :--- |
| `appAddress` | `String` | The app address to receive events from. |

#### Callback params

| Name | Type | Description |
| :--- | :--- | :--- |
| `event` | `Object` | An event that happened in the app. |
| `event.name` | `String` | The name of the event. |
| `event.appAddress` | `String` | The address of the app. |
| `event.repoName` | `String` | The name of the app’s repository. |

### appState

Start receiving the complete state of an app.

#### Listener params

| Name | Type | Description |
| :--- | :--- | :--- |
| `appAddress` | `String` | The app address to receive the state from. |

#### Callback params

| Name | Type | Description |
| :--- | :--- | :--- |
| `state` | `Object` | The current state of the app, as defined by the connector. |

### permissions

Start receiving the permissions of the org.

#### Callback params

| Name | Type | Description |
| :--- | :--- | :--- |
| `permissions` | `Permissions` | A `Permissions` instance. |

