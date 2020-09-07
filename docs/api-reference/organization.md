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

This method can throw one of the following errors:

| Error type                                                     | Description                                 |
| -------------------------------------------------------------- | ------------------------------------------- |
| [`ErrorNotFound`](./errors.md#error-not-found)                 | No app found.                               |
| [`ErrorUnexpectedResult`](./errors.md#error-unexpected-result) | The data couldn’t be fetched.               |
| [`ErrorConnection`](./errors.md#error-connection)              | The connection to the remote source failed. |

### Organization\#onApp\(appFilter, callback\)

Like `Organization#app()`, but as a subscription.

| Name                | Type                               | Description                                                                                                                                                                                                                                                   |
| ------------------- | ---------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `appFilter`         | `String` or object (optional)      | When a string is passed, the app will get searched by address if it starts by `0x`, and by `appName` otherwise. See `appFilter.address` and `appFilter.appName` to set them explicitly. For the time being, only one type of filter can get passed at a time. |
| `appFilter.address` | `String`                           | Same as `appFilter`, but makes the selection by `address` explicit.                                                                                                                                                                                           |
| `appFilter.appName` | `String`                           | Same as `appFilter`, but makes the selection by `appName` explicit.                                                                                                                                                                                           |
| `callback`          | `(error: Error, app: App) => void` | A callback that will get called every time the result gets updated.                                                                                                                                                                                           |
| returns             | `{ unsubscribe: () => void }`      | A handler that allows to stop receiving updates.                                                                                                                                                                                                              |

The error passed to `callback` can be `null` (no error) or one of the following:

| Error type                                                     | Description                                 |
| -------------------------------------------------------------- | ------------------------------------------- |
| [`ErrorNotFound`](./errors.md#error-not-found)                 | No app found.                               |
| [`ErrorUnexpectedResult`](./errors.md#error-unexpected-result) | The data couldn’t be fetched.               |
| [`ErrorConnection`](./errors.md#error-connection)              | The connection to the remote source failed. |

### Organization\#apps\(appFilter\)

Fetch apps from the organization.

| Name                | Type                                        | Description                                                                                                                                                                                                                                                                                                                        |
| ------------------- | ------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `appFilter`         | `String` or `String[]` or object (optional) | When a string is passed, apps will get filtered by address if it starts by `0x`, and by `appName` otherwise. When an array is passed, the first entry determines the type of filter. See `appFilter.address` and `appFilter.appName` to set them explicitly. For the time being, only one type of filter can get passed at a time. |
| `appFilter.address` | `String` or `String[]`                      | Same as `appFilter`, but makes the selection by `address` explicit.                                                                                                                                                                                                                                                                |
| `appFilter.appName` | `String` or `String[]`                      | Same as `appFilter`, but makes the selection by `appName` explicit.                                                                                                                                                                                                                                                                |
| returns             | `Promise<App[]>`                            | A promise resolving to the current list of apps.                                                                                                                                                                                                                                                                                   |

This method can throw one of the following errors:

| Error type                                                     | Description                                 |
| -------------------------------------------------------------- | ------------------------------------------- |
| [`ErrorUnexpectedResult`](./errors.md#error-unexpected-result) | The data couldn’t be fetched.               |
| [`ErrorConnection`](./errors.md#error-connection)              | The connection to the remote source failed. |

### Organization\#onApps\(appFilter, callback\)

Like `Organization#apps()`, but as a subscription.

| Name                | Type                                        | Description                                                                                                                                                                                                                                                                                                                        |
| ------------------- | ------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `appFilter`         | `String` or `String[]` or object (optional) | When a string is passed, apps will get filtered by address if it starts by `0x`, and by `appName` otherwise. When an array is passed, the first entry determines the type of filter. See `appFilter.address` and `appFilter.appName` to set them explicitly. For the time being, only one type of filter can get passed at a time. |
| `appFilter.address` | `String` or `String[]`                      | Same as `appFilter`, but makes the selection by `address` explicit.                                                                                                                                                                                                                                                                |
| `appFilter.appName` | `String` or `String[]`                      | Same as `appFilter`, but makes the selection by `appName` explicit.                                                                                                                                                                                                                                                                |
| `callback`          | `(error: Error, app:App) => void`           | A callback that will get called every time the result gets updated.                                                                                                                                                                                                                                                                |
| returns             | `{ unsubscribe: () => void }`               | A handler that allows to stop receiving updates.                                                                                                                                                                                                                                                                                   |

The error passed to `callback` can be `null` (no error) or one of the following:

| Error type                                                     | Description                                 |
| -------------------------------------------------------------- | ------------------------------------------- |
| [`ErrorUnexpectedResult`](./errors.md#error-unexpected-result) | The data couldn’t be fetched.               |
| [`ErrorConnection`](./errors.md#error-connection)              | The connection to the remote source failed. |

### Organization\#permissions\(\)

Fetch the organization’s permissions.

| Name    | Type                    | Description                             |
| ------- | ----------------------- | --------------------------------------- |
| returns | `Promise<Permission[]>` | A promise resolving to a `Permissions`. |

This method can throw one of the following errors:

| Error type                                                     | Description                                 |
| -------------------------------------------------------------- | ------------------------------------------- |
| [`ErrorUnexpectedResult`](./errors.md#error-unexpected-result) | The data couldn’t be fetched.               |
| [`ErrorConnection`](./errors.md#error-connection)              | The connection to the remote source failed. |

### Organization\#onPermissions\(callback\)

Like `Organization#permissions()`, but as a subscription.

| Name       | Type                          | Description                                                         |
| ---------- | ----------------------------- | ------------------------------------------------------------------- |
| `callback` | `(error, permission) => void` | A callback that will get called every time the result gets updated. |
| returns    | `{ unsubscribe: () => void }` | A handler that allows to stop receiving updates.                    |

The error passed to `callback` can be `null` (no error) or one of the following:

| Error type                                                     | Description                                 |
| -------------------------------------------------------------- | ------------------------------------------- |
| [`ErrorUnexpectedResult`](./errors.md#error-unexpected-result) | The data couldn’t be fetched.               |
| [`ErrorConnection`](./errors.md#error-connection)              | The connection to the remote source failed. |

### Organization\#appIntent\(appAddress, funcName, funcArgs\)

Execute a function on a given app.

| Name         | Type                         | Description                                             |
| ------------ | ---------------------------- | ------------------------------------------------------- |
| `appAddress` | `String`                     | Address of the app instance.                            |
| `funcName`   | `String`                     | Name of the function to call.                           |
| `funcArgs`   | `String`                     | Parameters to pass to the function.                     |
| returns      | `Promise<TransactionIntent>` | A promise resolving to an `TransactionIntent` instance. |
