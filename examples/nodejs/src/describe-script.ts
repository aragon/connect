import { connect } from '@1hive/connect'

async function main() {
  const org = await connect('beehive.aragonid.eth', 'thegraph')

  const script =
    '00000011f2dd05481168107cf149933603d4e31530fb51573bc318067f2467831e9d9d54f1e76e9c26b503495945f06fb6f4da9a09dc5276d9ab0834f82eae2be71ccef265a8d544767eeb4b9677ae19a8d4f7d8ef841f568fff8dba9deb18798a9b2d504ef26734661f3a0782732624b17e67b318ed230952e58368efecc7df8fdaf108e2e0c56046b625300da5e9a2a0291bda8f933e6bdc54118e69fed8b1e0408ae87ebe9cbd0a4561a757ae1eada062789d2e0ab4aadb8944b37dece81b224ac08cb8cc934a3c2db0c4066404e1a378c415e49b298d90a284520f9830b7731c23a5c89ed77cb01ed66ea9e7762167685e1801b88a3f882f9f6c6405248254659887d52c345845821462f27f0d24119760d96253135602c151cdd617ee2e073297e385190eb575a218561be34604b15d3e1307033da10ed7add198d8579c94852928b989141b004b8f6c56fb67cd0aaaa19d848f3898250dbacc53e8db31b91aa762146f5b40431a43d62bf95f8a99cb357071d4395d7188fd5e6d27f30d0708ae5c61b2b174e0e50875a6d9e97cb01a7f8543c9361a6d3ced452f7f5d1789b29b3ce6aeb748fda35545a3e8dabb9941794cabe473f00c99578ca6a3b65eaa1dd9cf2fa54d3908362801203e3d5ecca30bfbda6651562777284a20792b86e6d238b6fda9eaaba947a96278ea2d70e5235d27812ff4f438150c4c0450d6d57e49ec5c0b8e3f753c0ae0482b1980cbad3eac8d727ae0c0f40d9c23f2e8c8b08e4e9d7b00000000000000000000000000000000000000000000000000000000'

  const description = await org.describeScript(script)

  console.log('\nScript descriptions:')
  description.map((tx: any) => console.log(tx.description))
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('')
    console.error(err)
    console.log(
      'Please report any problem to https://github.com/aragon/connect/issues'
    )
    process.exit(1)
  })
