import { utils } from 'ethers'
import { AppMethod } from "@aragon/connect"
import { Reward } from '../types'

export const getRewards = (appId: string, fnData: AppMethod): Reward[] | undefined => {
  const {params, sig } = fnData

  if (!params || !params.length) {
    return
  }

  const sigHash = utils.id(sig).substring(0, 10)

  switch (appId) {
    // finance.aragonpm.eth
    case '0xbf8491150dafc5dcaee5b861414dca922de09ccffa344964ae167212e8c673ae': {
      switch (sigHash) {
        // newImmediatePayment(address,address,uint256,string)	
        case '0xf6364846':
          return [{
            receiver: params[1],
            token: params[0],
            amount: params[2].toString()
          }]
      }
      break
    }
    // agent.aragonpm.eth
    case '0x9ac98dc5f995bf0211ed589ef022719d1487e5cb2bab505676f0d084c07cf89a':
    // vault.aragonpm.eth
    // eslint-disable-next-line no-fallthrough
    case '0x7e852e0fcfce6551c13800f1e7476f982525c2b5277ba14b24339c68416336d1': 
      switch (sigHash) {
        // transfer(address,address,uint256)	
        case '0xbeabacc8':
          return [{
            receiver: params[1],
            token: params[0],
            amount: params[2].toString(),
          }]
      }
      break
  }
}
