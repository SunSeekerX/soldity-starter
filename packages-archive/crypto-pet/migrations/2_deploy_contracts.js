// const ConvertLib = artifacts.require("ConvertLib");
// const MetaCoin = artifacts.require("MetaCoin");
const CPET = artifacts.require('CPET')

module.exports = function (deployer) {
  deployer.deploy(CPET, 'Crypto Pet', 'CPET', 1000000000)
  // deployer.deploy(ConvertLib);
  // deployer.link(ConvertLib, MetaCoin);
  // deployer.deploy(MetaCoin);
}
