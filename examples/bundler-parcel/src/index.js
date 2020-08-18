import connect from '@aragon/connect'

connect('a1.aragonid.eth', 'thegraph').then((org) => {
  console.log('Organization:', org)
})
