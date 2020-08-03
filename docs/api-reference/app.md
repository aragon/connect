# App

An Aragon app installed in an organization from an [aragonPM repository](https://hack.aragon.org/docs/apm-intro).

## Properties

| Name                | Type                                 | Description                                                                                                                                   |
| ------------------- | ------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------- |
| `abi`               | `Abi`                                | The Ethereum contract ABI of the app contract.                                                                                                |
| `address`           | `String`                             | The address of the app proxy contract \(never changes\).                                                                                      |
| `appId`             | `String`                             | The `appName` encoded via [namehash](https://eips.ethereum.org/EIPS/eip-137).                                                                 |
| `appName`           | `String`                             | The app’s ENS identifier. E.g. `"token-manager.aragonpm.eth"`                                                                                 |
| `artifact`          | `AragonArtifact`                     | Metadata for the smart contract of the app, generated at publish.                                                                             |
| `codeAddress`       | `String`                             | The address of the app’s implementation contract \(changes with every major version\).                                                        |
| `contentUri`        | `String`                             | The location of the metadata content published with each version of the app. Empty for special apps like the kernel. E.g. `"ipfs:QmdLEDDfi…"` |
| `deprecatedIntents` | `{ [version]: TransactionIntent[] }` | Deprecated transaction intents, grouped by version.                                                                                           |
| `intents`           | `TransactionIntent[]`                | An array of transaction intents. It contains the Ethereum ABI, roles, and radspec notice attached to an intent.                               |
| `isForwarder`       | `Boolean`                            | Whether the app can act as a forwarder.                                                                                                       |
| `isUpgradeable`     | `Boolean`                            | Whether the app can be upgraded.                                                                                                              |
| `kernelAddress`     | `String`                             | The address of the kernel this app is installed on.                                                                                           |
| `manifest`          | `AragonManifest`                     | Publisher-specific metada.                                                                                                                    |
| `name`              | `String`                             | Name of the app, from the repository. E.g. `"Tokens"`.                                                                                        |
| `registryAddress`   | `String`                             | Address of the aragonPM registry this app’s repo is published to.                                                                             |
| `registry`          | `String`                             | Name of the aragonPM registry this app’s repo is published to. E.g. `"aragonpm.eth"`                                                          |
| `repoAddress`       | `String`                             | Address of the aragonPM repository the app was installed from.                                                                                |
| `version`           | `String`                             | The current version of the app.                                                                                                               |

## Methods

### App\#repo\(\)

Fetch the app’s aragonPM repository.

| Name    | Type            | Description                                           |
| ------- | --------------- | ----------------------------------------------------- |
| returns | `Promise<Repo>` | A promise resolving to the app’s aragonPM repository. |

### App\#roles\(\)

Fetch the app’s roles.

| Name    | Type              | Description                             |
| ------- | ----------------- | --------------------------------------- |
| returns | `Promise<Role[]>` | A promise resolving to the app’s roles. |
