function formatMessage(code: string, message: string): string {
  return `${message} (${code})`
}

function defineNonEnumerable(instance: object, name: string, value: any) {
  Object.defineProperty(instance, name, { value, enumerable: false })
}

type ErrorOptions = {
  code?: string
  name?: string
}

export class ErrorException extends Error {
  constructor(
    message = 'An unexpected error happened.',
    { code = 'AC0001', name = 'ErrorException' }: ErrorOptions = {}
  ) {
    super(formatMessage(code, message))
    defineNonEnumerable(this, 'name', name)
    defineNonEnumerable(this, 'code', code)
  }
}

export class ErrorInvalid extends ErrorException {
  constructor(
    message = 'The resource doesn’t seem to be valid.',
    { code = 'AC0002', name = 'ErrorInvalid' }: ErrorOptions = {}
  ) {
    super(message, { code, name })
  }
}

export class ErrorUnsupported extends ErrorException {
  constructor(
    message = 'The resource is not supported.',
    { code = 'AC0003', name = 'ErrorUnsupported' }: ErrorOptions = {}
  ) {
    super(message, { code, name })
  }
}

export class ErrorNotFound extends ErrorException {
  constructor(
    message = 'The resource couldn’t be found.',
    { code = 'AC0004', name = 'ErrorNotFound' }: ErrorOptions = {}
  ) {
    super(message, { code, name })
  }
}

export class ErrorConnection extends ErrorException {
  constructor(
    message = 'An error happened while communicating with a remote server.',
    { code = 'AC0005', name = 'ErrorNotFound' }: ErrorOptions = {}
  ) {
    super(message, { code, name })
  }
}

export class ErrorInvalidEthereum extends ErrorInvalid {
  constructor(
    message = 'The Ethereum provider doesn’t seem to be valid.',
    { code = 'AC0006', name = 'ErrorInvalidEthereum' }: ErrorOptions = {}
  ) {
    super(message, { code, name })
  }
}

export class ErrorInvalidLocation extends ErrorInvalid {
  constructor(
    message = 'The Ethereum address or ENS domain doesn’t seem to be valid.',
    { code = 'AC0007', name = 'ErrorInvalidLocation' }: ErrorOptions = {}
  ) {
    super(message, { code, name })
  }
}

export class ErrorInvalidNetwork extends ErrorInvalid {
  constructor(
    message = 'The network doesn’t seem to be valid.',
    { code = 'AC0008', name = 'ErrorInvalidNetwork' }: ErrorOptions = {}
  ) {
    super(message, { code, name })
  }
}

export class ErrorUnsufficientBalance extends ErrorException {
  constructor(
    message = 'Unsifficient balance on the account.',
    { code = 'AC0009', name = 'ErrorUnsufficientBalance' }: ErrorOptions = {}
  ) {
    super(message, { code, name })
  }
}
