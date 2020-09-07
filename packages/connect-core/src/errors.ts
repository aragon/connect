function formatMessage(message: string, reason: string): string {
  return message + reason ? ` (reason: ${reason})` : ''
}

function defineNonEnumerable(instance: object, name: string, value: any) {
  Object.defineProperty(instance, name, { value, enumerable: false })
}

type ErrorOptions = {
  code?: string
  name?: string
  reason?: string
}

export class ErrorException extends Error {
  constructor(
    message = 'An unexpected error happened.',
    {
      code = 'ErrorException',
      name = 'ErrorException',
      reason = '',
    }: ErrorOptions = {}
  ) {
    super(formatMessage(message, reason))
    defineNonEnumerable(this, 'name', name)
    defineNonEnumerable(this, 'code', code)
    defineNonEnumerable(this, 'reason', reason)
  }
}

export class ErrorInvalid extends ErrorException {
  constructor(
    message = 'The resource doesn’t seem to be valid.',
    { code = 'ErrorInvalid', name = 'ErrorInvalid', reason }: ErrorOptions = {}
  ) {
    super(message, { code, name, reason })
  }
}

export class ErrorUnsupported extends ErrorException {
  constructor(
    message = 'The resource is not supported.',
    {
      code = 'ErrorUnsupported',
      name = 'ErrorUnsupported',
      reason,
    }: ErrorOptions = {}
  ) {
    super(message, { code, name, reason })
  }
}

export class ErrorNotFound extends ErrorException {
  constructor(
    message = 'The resource couldn’t be found.',
    {
      code = 'ErrorNotFound',
      name = 'ErrorNotFound',
      reason,
    }: ErrorOptions = {}
  ) {
    super(message, { code, name, reason })
  }
}

export class ErrorConnection extends ErrorException {
  constructor(
    message = 'An error happened while communicating with a remote server.',
    {
      code = 'ErrorConnection',
      name = 'ErrorConnection',
      reason,
    }: ErrorOptions = {}
  ) {
    super(message, { code, name, reason })
  }
}

export class ErrorUnexpectedResult extends ErrorException {
  constructor(
    message = 'The resource doesn’t correspond to the expected result.',
    {
      code = 'ErrorUnexpectedResult',
      name = 'ErrorUnexpectedResult',
      reason,
    }: ErrorOptions = {}
  ) {
    super(message, { code, name, reason })
  }
}

export class ErrorInvalidEthereum extends ErrorInvalid {
  constructor(
    message = 'The Ethereum provider doesn’t seem to be valid.',
    {
      code = 'ErrorInvalidEthereum',
      name = 'ErrorInvalidEthereum',
      reason,
    }: ErrorOptions = {}
  ) {
    super(message, { code, name, reason })
  }
}

export class ErrorInvalidLocation extends ErrorInvalid {
  constructor(
    message = 'The Ethereum address or ENS domain doesn’t seem to be valid.',
    {
      code = 'ErrorInvalidLocation',
      name = 'ErrorInvalidLocation',
      reason,
    }: ErrorOptions = {}
  ) {
    super(message, { code, name, reason })
  }
}

export class ErrorInvalidNetwork extends ErrorInvalid {
  constructor(
    message = 'The network doesn’t seem to be valid.',
    {
      code = 'ErrorInvalidNetwork',
      name = 'ErrorInvalidNetwork',
      reason,
    }: ErrorOptions = {}
  ) {
    super(message, { code, name, reason })
  }
}

export class ErrorInvalidConnector extends ErrorInvalid {
  constructor(
    message = 'The connector doesn’t seem to be valid.',
    {
      code = 'ErrorInvalidConnector',
      name = 'ErrorInvalidConnector',
      reason,
    }: ErrorOptions = {}
  ) {
    super(message, { code, name, reason })
  }
}

export class ErrorInvalidApp extends ErrorInvalid {
  constructor(
    message = 'The value doesn’t seem to be an app.',
    {
      code = 'ErrorInvalidApp',
      name = 'ErrorInvalidApp',
      reason,
    }: ErrorOptions = {}
  ) {
    super(message, { code, name, reason })
  }
}

export class ErrorUnsufficientBalance extends ErrorException {
  constructor(
    message = 'Unsufficient balance on the account.',
    {
      code = 'ErrorUnsufficientBalance',
      name = 'ErrorUnsufficientBalance',
      reason,
    }: ErrorOptions = {}
  ) {
    super(message, { code, name, reason })
  }
}
