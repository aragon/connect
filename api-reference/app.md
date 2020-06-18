# App

An app installed in an organization from a repository.

## Properties

| Name | Type | Description |
| :--- | :--- | :--- |
| `abi` | `Abi` | The Ethereum contract ABI of the app contract. |
| `address` | `String` | The address of the app proxy contract \(never changes\). |
| `appId` | `String` | The appName but encoded. |
| `appName` | `String` | The app ENS identifier. E.g. `"token-manager.aragonpm.eth"` |
| `author` | `String` | App author, from the repository. E.g. `"Aragon Association"`. |
| `codeAddress` | `String` | The address of the app contract \(changes with every major version\). |
| `contentUri` | `String` | The location of the app content. Empty for special apps like the kernel. E.g. `"ipfs:QmdLEDDfi…"` |
| `contentUrl` | `String` | The HTTP URL of the app content. Uses the IPFS HTTP provider. E.g. `http://gateway.ipfs.io/ipfs/QmdLEDDfi…/` |
| `contractPath` | `String` | Path of the contract. E.g. `"contracts/TokenManager.sol"` |
| `description` | `String` | App description, from the repository. E.g. `"Manage an organization’s token supply and distribution."`. |
| `deprecatedIntents` | `{ [version]: AppIntent[] }` | Deprecated app intents, grouped by version. |
| `htmlUrl` | `String` | The HTTP URL of the app HTML page. Uses the IPFS HTTP provider. E.g. `http://gateway.ipfs.io/ipfs/QmdLEDDfi…/index.html` |
| `icons` | `{ src: String, sizes: String }[]` | Array of icons for the app \(follows the web app manifest `icons` format\). |
| `intents` | `AppIntent[]` | An array of app intents. It contains the Ethereum ABI, roles, and radspec notice attached to an intent. |
| `isForwarder` | `Boolean` | Whether the app can act as a forwarder. |
| `isUpgradeable` | `Boolean` | Whether the app can be upgraded. |
| `kernelAddress` | `String` | The address of the kernel. |
| `name` | `String` | Name of the app, from the repository. E.g. `"Tokens"`. |
| `registryAddress` | `String` | Address of the aragonPM registry for this app. |
| `registry` | `String` | Name of the aragonPM registry for this app. E.g. `"aragonpm.eth"` |
| `repoAddress` | `String` | Address of the Repo the app was installed from. |
| `sourceUrl` | `String` | URL of the app source code. |
| `version` | `String` | The current version of the app. |

## Methods

### App\#repo\(\)

Fetch the app repository.

| Name | Type | Description |
| :--- | :--- | :--- |
| returns | `Promise<Repo>` | A promise resolving to the app repository. |

### App\#roles\(\)

Fetch the app roles.

| Name | Type | Description |
| :--- | :--- | :--- |
| returns | `Promise<Role[]>` | A promise resolving to the app roles. |

