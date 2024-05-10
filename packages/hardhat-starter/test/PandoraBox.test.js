const { expect } = require('chai')

// Describe 块定义了一个测试套件
describe('PandoraBox contract', function () {
  // let PandoraBox // 合约的工厂
  let pandoraBox // 合约实例
  let owner // 账户信息

  // before 每个测试执行前都会运行
  // beforeEach(async function () {
  //   // 获取合约工厂和签署者
  //   // PandoraBox = await ethers.getContractFactory('PandoraBox')
  //   ;[owner] = await ethers.getSigners()

  //   // 部署合约
  //   // pandoraBox = await PandoraBox.deploy()
  // })

  before(async function () {
    // 这里填入PandoraBox的部署地址
    const address = '0xEC31d148aa7F50e46F696562DBcF6B5497a5D7F0'
    const PandoraBox = await ethers.getContractFactory('PandoraBox')
    ;[owner] = await ethers.getSigners()
    pandoraBox = PandoraBox.attach(address)
    console.log('pandoraBox abi>>>', pandoraBox?.interface?.fragments)
  })

  // 定义一个测试用例
  // it('Should initialize with num equal to 1', async function () {
  //   expect(await pandoraBox.num()).to.equal(1)
  // })

  // 测试 setNum 功能
  it('Should change num multiple times', async function () {
    // 第一次设置 num
    await pandoraBox.setNum(10)
    expect(await pandoraBox.num()).to.equal(10)

    // 第二次设置 num
    await pandoraBox.setNum(20)
    expect(await pandoraBox.num()).to.equal(20)

    // 第三次设置 num
    await pandoraBox.setNum(30)
    expect(await pandoraBox.num()).to.equal(30)
  })
})
