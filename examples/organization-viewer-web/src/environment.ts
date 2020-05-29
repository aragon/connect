type EnvType = {
  addresses: Map<string, string>
  daoSubgraphUrl: string
}

const ENV_NAME = 'MAINNET_STAGING'

const ENVIRONMENTS = new Map([
  [
    'MAINNET',
    {
      daoSubgraphUrl:
        'https://api.thegraph.com/subgraphs/name/aragon/aragon-mainnet',
      addresses: new Map([
        ['a1', '0x635193983512c621E6a3E15ee1dbF36f0C0Db8E0'],
      ]),
    },
  ],
  [
    'MAINNET_STAGING',
    {
      daoSubgraphUrl:
        'https://api.thegraph.com/subgraphs/name/aragon/aragon-mainnet-staging',
      addresses: new Map([
        ['piedao', '0x0c188b183ff758500d1d18b432313d10e9f6b8a4'],
      ]),
    },
  ],
  [
    'RINKEBY',
    {
      daoSubgraphUrl:
        'https://api.thegraph.com/subgraphs/name/aragon/aragon-rinkeby',
      addresses: new Map([
        ['org1', '0x0146414e5a819240963450332f647dfb7c722af4'],
        ['org2', '0x00018d22ece8b2ea4e9317b93f7dff67385693d8'],
        ['td.aragonid.eth', '0xa9Aad8e278eECf369c42F78D5A3f2d866DE902C8'],
        ['hive.aragonid.eth', '0xe520428C232F6Da6f694b121181f907931fD2211'],
        ['mesh.aragonid.eth', '0xa48300a4E89b59A79452Db7d3CD408Df57f4aa78'],
      ]),
    },
  ],
])

export const env = ENVIRONMENTS.get(ENV_NAME) as EnvType
