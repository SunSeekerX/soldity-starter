async function main() {
  /**
   * Box
   */
  // const Box = await ethers.getContractFactory('Box')
  // console.log('Deploying Box...')
  // const box = await Box.deploy()
  // await box.deployed()
  // console.log('Box deployed to:', box.address)

  /**
   * 4_Bot
   */
  // 合约名
  const contractName = 'PancakeswapV2FrontBot'
  const ContractObj = await ethers.getContractFactory(contractName)
  console.log(`Deploying ${contractName}...`)
  const contractObj = await ContractObj.deploy('SB token', 'SBT')
  await contractObj.deployed()
  console.log(`${contractName} deployed to:`, contractObj.address)
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
