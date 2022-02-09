/**
 * @type import('hardhat/config').HardhatUserConfig
 */
require('@nomiclabs/hardhat-ethers')

module.exports = {
  // solidity: '0.8.4',
  solidity: '0.6.6',
  defaultNetwork: 'ganache',
  networks: {
    hardhat: {},
    // ganache
    ganache: {
      url: 'http://127.0.0.1:7545',
      chainId: 1337,
      gas: 'auto',
      gasPrice: 'auto',
    },
  },
}
