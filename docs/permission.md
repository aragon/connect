# Permission

A single permission that represents the relation between an app role and an entity.

## Properties

| Name | Type | Description |
| :--- | :--- | :--- |
| `app` | `String` | App address. |
| `entity` | `String` | Entity address receiving the permission. |
| `role` | `String` | Role identifier. |

## Methods

### getApp\(\)

| Name | Type | Description |
| :--- | :--- | :--- |
| returns | `App` | App instance corresponding to the app address. |

### getRole\(\)

| Name | Type | Description |
| :--- | :--- | :--- |
| returns | `Role` | Role instance corresponding to the role identifier. |

