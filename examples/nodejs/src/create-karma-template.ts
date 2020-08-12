import { ethers, BigNumber } from 'ethers'

import { fetchRepo } from './helpers'

const envs = new Map(
  Object.entries({
    xdai: {
      rpc: 'https://xdai.poanetwork.dev',
      network: {
        chainId: 100,
        name: 'xdai',
        ensAddress: '0xaafca6b0c89521752e559650206d7c925fd0e530',
      },
      key: '0xa8a54b2d8197bc0b19bb8a084031be71835580a01e70a45a13babd16c9bc1563',
      templateAddress: '0x9b321667c89cf888785413b89178b78dc67747c8',
      subgraph: 'https://api.thegraph.com/subgraphs/name/1hive/aragon-xdai',
    },
  })
)

const env = envs.get(process.env.ETH_NETWORK || '') || envs.get('xdai')!

const TEMPLATE_NAME = 'karma-template'

const ONE_HUNDRED_PERCENT = 1e18
const ONE_TOKEN = 1e18

// Create dao transaction one config
const ORG_TOKEN_NAME = 'Honey'
const ORG_TOKEN_SYMBOL = 'HNY'
const SUPPORT_REQUIRED = 0.5 * ONE_HUNDRED_PERCENT
const MIN_ACCEPTANCE_QUORUM = 0.2 * ONE_HUNDRED_PERCENT
const VOTE_DURATION_BLOCKS = 241920 // ~14 days
const VOTE_BUFFER_BLOCKS = 5760 // 8 hours
const VOTE_EXECUTION_DELAY_BLOCKS = 34560 // 48 hours
const VOTING_SETTINGS = [
  BigNumber.from(SUPPORT_REQUIRED.toString()),
  BigNumber.from(MIN_ACCEPTANCE_QUORUM.toString()),
  VOTE_DURATION_BLOCKS,
  VOTE_BUFFER_BLOCKS,
  VOTE_EXECUTION_DELAY_BLOCKS,
]
const HOLDERS: string[] = []
const STAKES: BigNumber[] = []

// Create dao transaction two config
const TOLLGATE_FEE = BigNumber.from(ONE_TOKEN.toString()).mul(100)
const BLOCKS_PER_YEAR = 31557600 / 5 // seeconds per year divided by 15 (assumes 15 second average block time)
const ISSUANCE_RATE = BigNumber.from((60e18).toString()).div(
  BLOCKS_PER_YEAR.toString()
) // per Block Inflation Rate
const DECAY = 9999799 // 48 hours halftime
const MAX_RATIO = 1000000 // 10 percent
const MIN_THRESHOLD = 0.01 // half a percent
const WEIGHT = (MAX_RATIO ** 2 * MIN_THRESHOLD) / 10000000 // determine weight based on MAX_RATIO and MIN_THRESHOLD
const CONVICTION_SETTINGS = [
  DECAY,
  MAX_RATIO,
  BigNumber.from(WEIGHT.toString()),
]

async function main() {
  // create signer
  const provider = new ethers.providers.JsonRpcProvider(env.rpc, env.network)
  const wallet = new ethers.Wallet(env.key)
  const signer = wallet.connect(provider)

  // fetch repo
  const { lastVersion } = await fetchRepo(TEMPLATE_NAME, env.subgraph)
  const templateArtifact = JSON.parse(lastVersion.artifact)

  // create template contract
  const karmaTemplateContract = new ethers.Contract(
    env.templateAddress,
    templateArtifact.abi,
    signer
  )

  const createDaoTxOne = await karmaTemplateContract.createDaoTxOne(
    ORG_TOKEN_NAME,
    ORG_TOKEN_SYMBOL,
    HOLDERS,
    STAKES,
    VOTING_SETTINGS,
    { gasPrice: 5 }
  )
  const orgAddress = await getOrgAddress(
    'DeployDao',
    karmaTemplateContract,
    createDaoTxOne.hash
  )
  const reciptOne = await createDaoTxOne.wait()
  console.log(
    `Tx One Complete. DAO address: ${orgAddress} Gas used: ${reciptOne.gasUsed} `
  )

  const createDaoTxTwo = await karmaTemplateContract.createDaoTxTwo(
    TOLLGATE_FEE,
    ISSUANCE_RATE,
    CONVICTION_SETTINGS,
    { gasPrice: 5 }
  )
  const reciptTwo = await createDaoTxTwo.wait()
  console.log(`Tx Two Complete. Gas used: ${reciptTwo.gasUsed}`)
  console.log(`Karma template organization created.`)
}

export async function getOrgAddress(
  selectedFilter: string,
  templateContract: ethers.Contract,
  transactionHash: string
): Promise<string> {
  return new Promise((resolve, reject) => {
    const filter = templateContract.filters[selectedFilter]()

    templateContract.on(filter, (contractAddress, event) => {
      if (event.transactionHash === transactionHash) {
        templateContract.removeAllListeners()
        resolve(contractAddress)
      }
    })
  })
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.log(`Error: `, err)
    console.log(
      '\nPlease report any problem to https://github.com/aragon/connect/issues'
    )
    process.exit(1)
  })
