# Organization

An `Organization` instance represents an Aragon organization and exposes methods to interact with it.

## Methods

### Organization\#app\(appFilter\)

Fetch a specific app from the organization.

| Name                | Type                          | Description                                                                                                                                                                                                                                                   |
| ------------------- | ----------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `appFilter`         | `String` or object (optional) | When a string is passed, the app will get searched by address if it starts by `0x`, and by `appName` otherwise. See `appFilter.address` and `appFilter.appName` to set them explicitly. For the time being, only one type of filter can get passed at a time. |
| `appFilter.address` | `String`                      | Same as `appFilter`, but makes the selection by `address` explicit.                                                                                                                                                                                           |
| `appFilter.appName` | `String`                      | Same as `appFilter`, but makes the selection by `appName` explicit.                                                                                                                                                                                           |
| returns             | `Promise<App>`                | A promise resolving to an app.                                                                                                                                                                                                                                |

### Organization\#onApp\(appFilter, callback\)

Like `Organization#app()`, but as a subscription.

| Name                | Type                          | Description                                                                                                                                                                                                                                                   |
| ------------------- | ----------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `appFilter`         | `String` or object (optional) | When a string is passed, the app will get searched by address if it starts by `0x`, and by `appName` otherwise. See `appFilter.address` and `appFilter.appName` to set them explicitly. For the time being, only one type of filter can get passed at a time. |
| `appFilter.address` | `String`                      | Same as `appFilter`, but makes the selection by `address` explicit.                                                                                                                                                                                           |
| `appFilter.appName` | `String`                      | Same as `appFilter`, but makes the selection by `appName` explicit.                                                                                                                                                                                           |
| `callback`          | `app => void`                 | A callback that will get called every time the result gets updated.                                                                                                                                                                                           |
| returns             | `{ unsubscribe: () => void }` | A handler that allows to stop receiving updates.                                                                                                                                                                                                              |

### Organization\#apps\(appFilter\)

Fetch apps from the organization.

| Name                | Type                                        | Description                                                                                                                                                                                                                                                                                                                        |
| ------------------- | ------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `appFilter`         | `String` or `String[]` or object (optional) | When a string is passed, apps will get filtered by address if it starts by `0x`, and by `appName` otherwise. When an array is passed, the first entry determines the type of filter. See `appFilter.address` and `appFilter.appName` to set them explicitly. For the time being, only one type of filter can get passed at a time. |
| `appFilter.address` | `String` or `String[]`                      | Same as `appFilter`, but makes the selection by `address` explicit.                                                                                                                                                                                                                                                                |
| `appFilter.appName` | `String` or `String[]`                      | Same as `appFilter`, but makes the selection by `appName` explicit.                                                                                                                                                                                                                                                                |
| returns             | `Promise<App[]>`                            | A promise resolving to the current list of apps.                                                                                                                                                                                                                                                                                   |

### Organization\#onApps\(appFilter, callback\)

Like `Organization#apps()`, but as a subscription.

| Name                | Type                                        | Description                                                                                                                                                                                                                                                                                                                        |
| ------------------- | ------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `appFilter`         | `String` or `String[]` or object (optional) | When a string is passed, apps will get filtered by address if it starts by `0x`, and by `appName` otherwise. When an array is passed, the first entry determines the type of filter. See `appFilter.address` and `appFilter.appName` to set them explicitly. For the time being, only one type of filter can get passed at a time. |
| `appFilter.address` | `String` or `String[]`                      | Same as `appFilter`, but makes the selection by `address` explicit.                                                                                                                                                                                                                                                                |
| `appFilter.appName` | `String` or `String[]`                      | Same as `appFilter`, but makes the selection by `appName` explicit.                                                                                                                                                                                                                                                                |
| `callback`          | `app => void`                               | A callback that will get called every time the result gets updated.                                                                                                                                                                                                                                                                |
| returns             | `{ unsubscribe: () => void }`               | A handler that allows to stop receiving updates.                                                                                                                                                                                                                                                                                   |

### Organization\#permissions\(\)

Fetch the organization’s permissions.

| Name    | Type                    | Description                             |
| ------- | ----------------------- | --------------------------------------- |
| returns | `Promise<Permission[]>` | A promise resolving to a `Permissions`. |

### Organization\#onPermissions\(callback\)

Like `Organization#permissions()`, but as a subscription.

| Name       | Type                          | Description                                                         |
| ---------- | ----------------------------- | ------------------------------------------------------------------- |
| `callback` | `permission => void`          | A callback that will get called every time the result gets updated. |
| returns    | `{ unsubscribe: () => void }` | A handler that allows to stop receiving updates.                    |

### Organization\#appIntent\(appAddress, funcName, funcArgs\)

Execute a function on a given app.

| Name         | Type                         | Description                                             |
| ------------ | ---------------------------- | ------------------------------------------------------- |
| `appAddress` | `String`                     | Address of the app instance.                            |
| `funcName`   | `String`                     | Name of the function to call.                           |
| `funcArgs`   | `String`                     | Parameters to pass to the function.                     |
| returns      | `Promise<TransactionIntent>` | A promise resolving to an `TransactionIntent` instance. |
