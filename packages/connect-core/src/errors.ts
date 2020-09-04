function formatMessage(code: string, message: string): string {
  return `${message} (${code})`
}

function defineNonEnumerable(instance: object, name: string, value: any) {
  Object.defineProperty(instance, name, { value, enumerable: false })
}

type ErrorOptions = {
  code?: string
  name?: string
  variant?: string
}

export class ErrorException extends Error {
  constructor(
    message = 'An unexpected error happened.',
    {
      code = 'AC0001',
      name = 'ErrorException',
      variant = '',
    }: ErrorOptions = {}
  ) {
    super(formatMessage(code, message))
    defineNonEnumerable(this, 'name', name)
    defineNonEnumerable(this, 'code', code)
    defineNonEnumerable(this, 'variant', variant)
  }
}

export class ErrorInvalid extends ErrorException {
  constructor(
    message = 'The resource doesn’t seem to be valid.',
    { code = 'AC0002', name = 'ErrorInvalid', variant }: ErrorOptions = {}
  ) {
    super(message, { code, name, variant })
  }
}

export class ErrorUnsupported extends ErrorException {
  constructor(
    message = 'The resource is not supported.',
    { code = 'AC0003', name = 'ErrorUnsupported', variant }: ErrorOptions = {}
  ) {
    super(message, { code, name, variant })
  }
}

export class ErrorNotFound extends ErrorException {
  constructor(
    message = 'The resource couldn’t be found.',
    { code = 'AC0004', name = 'ErrorNotFound', variant }: ErrorOptions = {}
  ) {
    super(message, { code, name, variant })
  }
}

export class ErrorConnection extends ErrorException {
  constructor(
    message = 'An error happened while communicating with a remote server.',
    { code = 'AC0005', name = 'ErrorNotFound', variant }: ErrorOptions = {}
  ) {
    super(message, { code, name, variant })
  }
}

export class ErrorUnexpectedResult extends ErrorException {
  constructor(
    message = 'The resource doesn’t correspond to the expected result.',
    {
      code = 'AC0006',
      name = 'ErrorUnexpectedResult',
      variant,
    }: ErrorOptions = {}
  ) {
    super(message, { code, name, variant })
  }
}

export class ErrorInvalidEthereum extends ErrorInvalid {
  constructor(
    message = 'The Ethereum provider doesn’t seem to be valid.',
    {
      code = 'AC0007',
      name = 'ErrorInvalidEthereum',
      variant,
    }: ErrorOptions = {}
  ) {
    super(message, { code, name, variant })
  }
}

export class ErrorInvalidLocation extends ErrorInvalid {
  constructor(
    message = 'The Ethereum address or ENS domain doesn’t seem to be valid.',
    {
      code = 'AC0008',
      name = 'ErrorInvalidLocation',
      variant,
    }: ErrorOptions = {}
  ) {
    super(message, { code, name, variant })
  }
}

export class ErrorInvalidNetwork extends ErrorInvalid {
  constructor(
    message = 'The network doesn’t seem to be valid.',
    {
      code = 'AC0009',
      name = 'ErrorInvalidNetwork',
      variant,
    }: ErrorOptions = {}
  ) {
    super(message, { code, name, variant })
  }
}

export class ErrorUnsufficientBalance extends ErrorException {
  constructor(
    message = 'Unsufficient balance on the account.',
    {
      code = 'AC0010',
      name = 'ErrorUnsufficientBalance',
      variant,
    }: ErrorOptions = {}
  ) {
    super(message, { code, name, variant })
  }
}
