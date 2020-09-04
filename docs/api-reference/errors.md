# Errors

This file documents the different errors that can be emitted by the different Connect packages. It can be done through a `throw` / `catch`, or by passing the error object directly (in the React API).

## ErrorException

An unexpected error happened. This error should generally be avoided and replaced by a specific error type.

Extends: `Error`

Code: `AC0001`

## ErrorInvalid

The resource doesn’t seem to be valid. A typical case for this is that an invalid parameter type has been passed to a function.

Extends: `ErrorException`

Code: `AC0002`

## ErrorUnsupported

The resource is not supported. For example, when trying to enable a connector that doesn’t exist.

Extends: `ErrorException`

Code: `AC0003`

## ErrorNotFound

The resource couldn’t be found.

Extends: `ErrorException`

Code: `AC0004`

## ErrorConnection

An error happened while communicating with a remote server. This is a general error that can be emitted when a remote connection fails in some way.

Extends: `ErrorException`

Code: `AC0004`

## ErrorInvalidEthereum

The Ethereum provider doesn’t seem to be valid.

Extends: `ErrorInvalid`

Code: `AC0005`

## ErrorInvalidLocation

The Ethereum address or ENS domain doesn’t seem to be valid.

Extends: `ErrorInvalid`

Code: `AC0006`

## ErrorInvalidNetwork

The network doesn’t seem to be valid.

Extends: `ErrorInvalid`

Code: `AC0007`

## ErrorUnsufficientBalance

Unsifficient balance on the account.

Extends: `ErrorException`

Code: `AC0008`
