// scripts/index.js
async function main() {
  // Our code will go here
  // Retrieve accounts from the local node
  const accounts = await ethers.provider.listAccounts()
  console.log(accounts)

  // 这里替换为控制台部署输出的合约地址
  const address = '0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0'
  const Box = await ethers.getContractFactory('Box')
  const box = await Box.attach(address)

  // 获取盒子里的值
  const value1 = await box.retrieve()
  console.log('Box value is', value1.toString())

  // 存入一个新的值
  await box.store(23)

  // 获取存入的值
  const value2 = await box.retrieve()
  console.log('Box value is', value2.toString())
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
