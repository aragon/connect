import connect from '@1hive/connect'

connect('a1.aragonid.eth', 'thegraph').then((org) => {
  console.log('Organization:', org)
})
