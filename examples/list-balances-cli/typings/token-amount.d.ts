declare module 'token-amount' {
  export class TokenAmount {
    format(
      amount: BigInt | string | number,
      decimals: BigInt | string | number,
      options?: {
        displaySign: boolean
        symbol: string
      }
    ): string
  }
}
