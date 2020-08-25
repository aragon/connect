import connect from '@aragon/connect'
import connectVoting, { Voting, Vote, Cast } from '@aragon/connect-voting'
import { keepRunning } from './helpers'

const ORG_ADDRESS = '0x7cee20f778a53403d4fc8596e88deb694bc91c98'
const VOTING_APP_ADDRESS = '0xf7f9a33ed13b01324884bd87137609251b5f7c88'

async function main() {
  const org = await connect(ORG_ADDRESS, 'thegraph', { network: 4 })
  const voting = await connectVoting(org.app(VOTING_APP_ADDRESS))

  const votesSubscription = voting.onVotes(
    {},
    (error: Error | null, votes?: Vote[]) => {
      if (error) {
        console.error(error)
        return
      }
      console.log('\nVotes: ')

      votes = votes as Vote[]

      votes
        .map((vote, index) => ({
          index,
          title: vote.metadata,
          id: vote.id,
        }))
        .forEach((vote) => {
          console.log(vote)
        })

      console.log(
        `\nTry creating a new vote at https://rinkeby.aragon.org/#/${ORG_ADDRESS}/${VOTING_APP_ADDRESS}/\n`
      )
    }
  )

  const votes = await voting.votes()
  const vote1 = votes[1]
  console.log(`Vote #1: `, vote1)

  const castsSubscription = vote1.onCasts(
    (error: Error | null, casts?: Cast[]) => {
      if (error) {
        console.error(error)
        return
      }
      console.log(`\nCasts:`)
      for (const cast of casts as Cast[]) {
        console.log(cast)
      }
      console.log(
        `\nTry casting a vote on https://rinkeby.aragon.org/#/${ORG_ADDRESS}/${VOTING_APP_ADDRESS}/vote/1 (You must first mint yourself a token in the Token Manager)\n`
      )
    }
  )

  await keepRunning()

  // Simply to illustrate how to close a subscription
  votesSubscription.unsubscribe()
  castsSubscription.unsubscribe()
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
