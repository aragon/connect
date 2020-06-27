# Repo

An app repository.

## Properties

| Name | Type | Description |
| :--- | :--- | :--- |
| `Address` | `String` | Address of the repo. |
| `author` | `String` | Author of the app. E.g. `"Aragon Association"`. |
| `changelogUrl` | `String` | URL of the app versions changelog. |
| `descriptionUrl` | `String` | URL pointing to the long description of the app. |
| `description` | `String` | Description of the app. E.g. `"Manage an organization’s token supply and distribution."`. |
| `environments` | `{ [chainId]: { registry: String, appName: String, chainId: String } }` | Environments supported by the app. |
| `icons` | `{ src: String, sizes: String }[]` | Icons of the app \(follows the web app manifest `icons` format\). |
| `name` | `String` | Name of the app. E.g. `"Tokens"`. |
| `roles` | `Role[]` | Roles supported by the app. |
| `screenshots` | `String[]` | Array of screenshots for the app. |
| `sourceUrl` | `String` | URL for the source code of the app. |

