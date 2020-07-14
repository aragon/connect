# Repo

An aragonPM repository.

## Properties

| Name              | Type             | Description                                                                                       |
| ----------------- | ---------------- | ------------------------------------------------------------------------------------------------- |
| `address`         | `String`         | Address of the repo.                                                                              |
| `artifact`        | `AragonArtifact` | Metadata for the smart contract of the app, generated at publish.                                 |
| `contentUri`      | `String`         | The location of the app content. Empty for special apps like the kernel. E.g. `"ipfs:QmdLEDDfi…"` |
| `name`            | `String`         | Name of the app. E.g. `"Tokens"`.                                                                 |
| `manifest`        | `AragonManifest` | Publisher-specific metada.                                                                        |
| `roles`           | `Role[]`         | Roles supported by the app.                                                                       |
| `registry`        | `String`         | Name of the aragonPM registry where the repository . E.g. `"aragonpm.eth"`                        |
| `registryAddress` | `String`         | Address of the aragonPM registry for this app.                                                    |
