import { ethers, providers } from 'ethers'
import { fetchRepo } from './helpers'

const ARAGON_MNEMONIC =
  'explain tackle mirror kit van hammer degree position ginger unfair soup bonus'

const MAIN_SUBGRAPH_RINKEBY =
  'https://api.thegraph.com/subgraphs/name/aragon/aragon-rinkeby'

const TEMPLATE_NAME = 'bare-template'

async function main() {
  // fetch Repos data
  const { data } = await fetchRepo(TEMPLATE_NAME, MAIN_SUBGRAPH_RINKEBY)

  // parse data from last version published
  const { lastVersion } = data.repos[0]
  const templateAddress = lastVersion.codeAddress
  const templateArtifact = JSON.parse(lastVersion.artifact)

  // create signer
  const provider = ethers.getDefaultProvider('rinkeby')
  const wallet = ethers.Wallet.fromMnemonic(ARAGON_MNEMONIC)
  wallet.connect(provider)

  // create template contract
  const templateContract = new ethers.Contract(
    templateAddress,
    templateArtifact.abi,
    wallet
  )

  const tx = await templateContract.functions.newInstance()
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
