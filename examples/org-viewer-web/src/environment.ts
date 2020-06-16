type EnvType = {
  addresses: string[]
  chainId: number
  orgSubgraphUrl?: string
}

const ENV_NAME = 'rinkeby'

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
    'mainnet_staging',
    {
      chainId: 1,
      orgSubgraphUrl:
        'https://api.thegraph.com/subgraphs/name/aragon/aragon-mainnet-staging',
      addresses: ['piedao.aragonid.eth'],
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
