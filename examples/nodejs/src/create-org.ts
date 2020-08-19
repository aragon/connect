import { ethers } from 'ethers'
import { fetchRepo, getOrgAddress } from './helpers'

const ARAGON_MNEMONIC =
  'explain tackle mirror kit van hammer degree position ginger unfair soup bonus'

const MAIN_SUBGRAPH_RINKEBY =
  'https://api.thegraph.com/subgraphs/name/aragon/aragon-rinkeby'

const TEMPLATE_NAME = 'bare-template'

async function main() {
  // fetch repo
  const { lastVersion } = await fetchRepo(TEMPLATE_NAME, MAIN_SUBGRAPH_RINKEBY)
  const templateAddress = lastVersion.codeAddress
  const templateArtifact = JSON.parse(lastVersion.artifact)

  // create signer
  const provider = ethers.getDefaultProvider('rinkeby')
  const wallet = ethers.Wallet.fromMnemonic(ARAGON_MNEMONIC)
  const signer = wallet.connect(provider)

  // create template contract
  const templateContract = new ethers.Contract(
    templateAddress,
    templateArtifact.abi,
    signer
  )

  // Get the proper function we want to call; ethers will not get the overload
  // automatically, so we take the proper one from the object, and then call it.
  const tx = await templateContract['newInstance()']()

  // Filter and get the org address from the events.
  const orgAddress = await getOrgAddress('DeployDao', templateContract, tx.hash)

  console.log(`Organization Address: ${orgAddress}`)
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
