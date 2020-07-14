import { ethers, BigNumber } from 'ethers'
import { fetchRepo } from './helpers'

import MiniMeToken from './artifacts/MiniMeToken.json'
import Token from './artifacts/Token.json'

const privateKey =
  '0xa8a54b2d8197bc0b19bb8a084031be71835580a01e70a45a13babd16c9bc1563'

const DAO_ID = 'gardens' + Math.random() // Note this must be unique for each deployment, change it for subsequent deployments
const TOKEN_OWNER = '0x625236038836CecC532664915BD0399647E7826b'
const NON_MINIME_COLLATERAL = false
const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000'

const DAYS = 24 * 60 * 60
const ONE_HUNDRED_PERCENT = 1e18
const ONE_TOKEN = 1e18
const FUNDRAISING_ONE_HUNDRED_PERCENT = 1e6
const FUNDRAISING_ONE_TOKEN = 1e6

const COLLATERAL_TOKEN_NAME = 'Honey'
const COLLATERAL_TOKEN_SYMBOL = 'HNY'
const COLLATERAL_TOKEN_DECIMALS = 18
const COLLATERAL_TOKEN_TRANSFERS_ENABLED = true
const COLLATERAL_BALANCE = 10e23

// Create dao transaction one config
const ORG_TOKEN_NAME = 'OrgToken'
const ORG_TOKEN_SYMBOL = 'OGT'
const SUPPORT_REQUIRED = 0.5 * ONE_HUNDRED_PERCENT
const MIN_ACCEPTANCE_QUORUM = 0.2 * ONE_HUNDRED_PERCENT
const VOTE_DURATION_BLOCKS = 15
const VOTE_BUFFER_BLOCKS = 10
const VOTE_EXECUTION_DELAY_BLOCKS = 5
const VOTING_SETTINGS = [
  BigNumber.from(SUPPORT_REQUIRED.toString()),
  BigNumber.from(MIN_ACCEPTANCE_QUORUM.toString()),
  VOTE_DURATION_BLOCKS,
  VOTE_BUFFER_BLOCKS,
  VOTE_EXECUTION_DELAY_BLOCKS,
]
const USE_AGENT_AS_VAULT = false

// Create dao transaction two config
const TOLLGATE_FEE = BigNumber.from(ONE_TOKEN.toString())
const USE_CONVICTION_AS_FINANCE = true
const FINANCE_PERIOD = BigNumber.from(0) // Irrelevant if using conviction as finance

// Create dao transaction three config
const PRESALE_GOAL = BigNumber.from(1000).mul(ONE_TOKEN.toString())
const PRESALE_PERIOD = BigNumber.from(14).mul(DAYS)
const PRESALE_EXCHANGE_RATE = BigNumber.from(FUNDRAISING_ONE_TOKEN)
const VESTING_CLIFF_PERIOD = BigNumber.from(90).mul(DAYS)
const VESTING_COMPLETE_PERIOD = BigNumber.from(360).mul(DAYS)
const PRESALE_PERCENT_SUPPLY_OFFERED = BigNumber.from(
  FUNDRAISING_ONE_HUNDRED_PERCENT
)
const PRESALE_PERCENT_FUNDING_FOR_BENEFICIARY = BigNumber.from(
  (0.5 * FUNDRAISING_ONE_HUNDRED_PERCENT).toString()
)
const OPEN_DATE = BigNumber.from(0)
const BUY_FEE_PCT = BigNumber.from((0.2 * ONE_HUNDRED_PERCENT).toString())
const SELL_FEE_PCT = BigNumber.from((0.2 * ONE_HUNDRED_PERCENT).toString())

// Create dao transaction four config
const VIRTUAL_SUPPLY = BigNumber.from(2)
const VIRTUAL_BALANCE = BigNumber.from(1)
const RESERVE_RATIO = BigNumber.from(
  (0.1 * FUNDRAISING_ONE_HUNDRED_PERCENT).toString()
)

async function main() {
  // Subgraph
  const MAIN_SUBGRAPH_RINKEBY =
    'https://api.thegraph.com/subgraphs/name/1hive/aragon-xdai'

  const TEMPLATE_NAME = 'gardens-template'

  const templateAddress = '0xa21b6c0ac58e2d21114ed3e88cec769234e41ece' // Hardcode Address deployed to xDai

  // 0x2Cd20c209FB30e403Ac365e961aD7B879a327476

  // fetch Repos data
  const { data } = await fetchRepo(TEMPLATE_NAME, MAIN_SUBGRAPH_RINKEBY)

  // parse data from last version published
  const { lastVersion } = data.repos[0]
  const templateArtifact = JSON.parse(lastVersion.artifact)

  // create signer
  const provider = new ethers.providers.JsonRpcProvider(
    'https://xdai.poanetwork.dev',
    {
      chainId: 100,
      name: 'xdai',
      ensAddress: '0xaafca6b0c89521752e559650206d7c925fd0e530',
    }
  )
  const wallet = new ethers.Wallet(privateKey)
  const signer = wallet.connect(provider)

  // create template contract
  const templateContract = new ethers.Contract(
    templateAddress,
    templateArtifact.abi,
    signer
  )

  let collateralToken

  if (NON_MINIME_COLLATERAL) {
    const tokenFactory = new ethers.ContractFactory(
      Token.abi,
      Token.bytecode,
      signer
    )
    collateralToken = await tokenFactory.deploy(
      TOKEN_OWNER,
      COLLATERAL_TOKEN_NAME,
      COLLATERAL_TOKEN_SYMBOL
    )
    collateralToken.deployTransaction.wait()
  } else {
    const minimeFactory = new ethers.ContractFactory(
      MiniMeToken.abi,
      MiniMeToken.bytecode,
      signer
    )
    collateralToken = await minimeFactory.deploy(
      ZERO_ADDRESS,
      ZERO_ADDRESS,
      0,
      COLLATERAL_TOKEN_NAME,
      COLLATERAL_TOKEN_DECIMALS,
      COLLATERAL_TOKEN_SYMBOL,
      COLLATERAL_TOKEN_TRANSFERS_ENABLED
    )
    collateralToken.deployTransaction.wait()
    collateralToken.generateTokens(TOKEN_OWNER, COLLATERAL_BALANCE)
  }
  console.log(
    `Created ${COLLATERAL_TOKEN_SYMBOL} Token: ${collateralToken.address}`
  )

  const createDaoTxOne = await templateContract.createDaoTxOne(
    ORG_TOKEN_NAME,
    ORG_TOKEN_SYMBOL,
    VOTING_SETTINGS,
    USE_AGENT_AS_VAULT,
    { gasPrice: 4 }
  )
  const reciptOne = await createDaoTxOne.wait()
  console.log(`Tx One Complete.`)

  const createDaoTxTwo = await templateContract.createDaoTxTwo(
    collateralToken.address,
    TOLLGATE_FEE,
    [collateralToken.address],
    USE_CONVICTION_AS_FINANCE,
    FINANCE_PERIOD,
    collateralToken.address,
    { gasPrice: 4, gasLimit: 6500000 }
  )
  const reciptTwo = await createDaoTxTwo.wait()

  console.log(`Tx Two Complete.`)

  const createDaoTxThree = await templateContract.createDaoTxThree(
    PRESALE_GOAL,
    PRESALE_PERIOD,
    PRESALE_EXCHANGE_RATE,
    VESTING_CLIFF_PERIOD,
    VESTING_COMPLETE_PERIOD,
    PRESALE_PERCENT_SUPPLY_OFFERED,
    PRESALE_PERCENT_FUNDING_FOR_BENEFICIARY,
    OPEN_DATE,
    BUY_FEE_PCT,
    SELL_FEE_PCT,
    { gasPrice: 4, gasLimit: 6500000 }
  )
  const reciptThree = await createDaoTxTwo.wait()
  console.log(`Tx Three Complete.`)

  const createDaoTxFour = await templateContract.createDaoTxFour(
    DAO_ID,
    VIRTUAL_SUPPLY,
    VIRTUAL_BALANCE,
    RESERVE_RATIO
  )
  const reciptFour = await createDaoTxTwo.wait()
  console.log(`Tx Four Complete.`)
}

main()
  .then(() => process.exit(0))
  .catch(err => {
    console.log(`Error: `, err)
    console.log(
      '\nPlease report any problem to https://github.com/aragon/connect/issues'
    )
    process.exit(1)
  })
