# Role

A single role, which can get assigned to create a permission.

## Properties

| Name | Type | Description |
| :--- | :--- | :--- |
| `name` | `String` | Name of the role. E.g. `"Mint tokens"`. |
| `id` | `String` | Identifier of the role. E.g. `"MINT_ROLE"`. |
| `params` | `String[]` | Params associated to the role. E.g. `[ "Receiver", "Token amount" ]`. |
| `bytes` | `String` | Encoded identifier for the role. |
| `manager` | `String` | Address of the role manager. |

