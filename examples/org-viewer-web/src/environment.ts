type EnvType = {
  addresses: string[]
  chainId: number
}

const ENV_NAME = 'mainnet'

const ENVIRONMENTS = new Map([
  [
    'mainnet',
    {
      chainId: 1,
      addresses: [
        'a1.aragonid.eth',
        'governance.aragonproject.eth',
        'brightid.aragonid.eth',
      ],
    },
  ],
  [
    'rinkeby',
    {
      chainId: 4,
      addresses: ['gardens.aragonid.eth'],
    },
  ],
])

export const env = ENVIRONMENTS.get(ENV_NAME) as EnvType
