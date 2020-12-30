# Errors

This file documents the different errors that can be emitted by the different Connect packages. It can be done through a `throw` / `catch`, or by passing the error object directly (in the React API).

## ErrorException

Extends: `Error`

An unexpected error happened. This error should generally be avoided and replaced by a specific error type.

## ErrorInvalid

The resource doesn’t seem to be valid. A typical case for this is that an invalid parameter type has been passed to a function.

Extends: `ErrorException`

## ErrorUnsupported

The resource is not supported. For example, when trying to enable a connector that doesn’t exist.

Extends: `ErrorException`

## ErrorNotFound

The resource couldn’t be found.

Extends: `ErrorException`

## ErrorConnection

An error happened while communicating with a remote server. This is a general error that can be emitted when a remote connection fails in some way.

Extends: `ErrorException`

## ErrorUnexpectedResult

The resource doesn’t correspond to the expected result.

Extends: `ErrorException`

## ErrorInvalidEthereum

The Ethereum provider doesn’t seem to be valid.

Extends: `ErrorInvalid`

## ErrorInvalidLocation

The Ethereum address or ENS domain doesn’t seem to be valid.

Extends: `ErrorInvalid`

## ErrorInvalidNetwork

The network doesn’t seem to be valid.

Extends: `ErrorInvalid`

## ErrorInvalidConnector

The connector doesn’t seem to be valid.

Extends: `ErrorInvalid`

## ErrorInvalidApp

The value doesn’t seem to be an app.

Extends: `ErrorInvalidApp`

## ErrorUnsufficientBalance

Unsifficient balance on the account.

Extends: `ErrorException`
