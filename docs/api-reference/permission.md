# Permission

A single permission that represents the relation between an app role and an entity.

## Properties

| Name             | Type          | Description                                                                                                                                                                                                                 |
| ---------------- | ------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `allowed`        | `Boolean`     | Whether the entity is allowed for the permission.                                                                                                                                                                           |
| `appAddress`     | `String`      | App address.                                                                                                                                                                                                                |
| `granteeAddress` | `String`      | Entity address receiving the permission.                                                                                                                                                                                    |
| `params`         | `ParamData[]` | An array of ParamData. It contains the `argumentId`, `operationType` and `argumentValue` of each paramenter as described in [Parameter interpretation](https://hack.aragon.org/docs/aragonos-ref#parameter-interpretation). |
| `roleHash`       | `String`      | Encoded identifier for the role.                                                                                                                                                                                            |

## Methods

### getApp\(\)

| Name    | Type  | Description                                    |
| ------- | ----- | ---------------------------------------------- |
| returns | `App` | App instance corresponding to the app address. |

### getRole\(\)

| Name    | Type   | Description                                         |
| ------- | ------ | --------------------------------------------------- |
| returns | `Role` | Role instance corresponding to the role identifier. |
