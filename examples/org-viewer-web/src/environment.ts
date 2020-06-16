type EnvType = {
  addresses: string[]
  chainId: number
  daoSubgraphUrl: string
}

const ENV_NAME = 'rinkeby'

const ENVIRONMENTS = new Map([
  [
    'mainnet',
    {
      chainId: 1,
      daoSubgraphUrl:
        'https://api.thegraph.com/subgraphs/name/aragon/aragon-mainnet',
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
      daoSubgraphUrl:
        'https://api.thegraph.com/subgraphs/name/aragon/aragon-mainnet-staging',
      addresses: ['piedao.aragonid.eth'],
    },
  ],
  [
    'rinkeby',
    {
      chainId: 4,
      daoSubgraphUrl:
        'https://api.thegraph.com/subgraphs/name/aragon/aragon-rinkeby',
      addresses: ['gardens.aragonid.eth'],
    },
  ],
])

export const env = ENVIRONMENTS.get(ENV_NAME) as EnvType
