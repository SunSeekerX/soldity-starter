// scripts/index.js
module.exports = async function main(callback) {
  try {
    // Our code will go here
    // Retrieve accounts from the local node
    const accounts = await web3.eth.getAccounts()
    console.log(accounts)

    // Set up a Truffle contract, representing our deployed Box instance
    const Box = artifacts.require('Box')
    const box = await Box.deployed()

    // 获取盒子里的值
    const value1 = await box.retrieve()
    console.log('Box value is', value1.toString())

    // 存入一个新的值
    await box.store(23)

    // 获取存入的值
    const value2 = await box.retrieve()
    console.log('Box value is', value2.toString())
    callback(0)
  } catch (error) {
    console.error(error)
    callback(1)
  }
}
