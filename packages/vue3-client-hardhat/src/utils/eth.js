import { ethers } from 'ethers'

// 校验是否为 eth 地址
export function isValidAddress(address) {
  return ethers.utils.isAddress(address)
}

// 通过助记词获取地址
export function getAddressByMnemonic(mnemonic) {
  const wallet = ethers.Wallet.fromMnemonic(mnemonic)
  return wallet.address
}

// 通过助记词获取私钥
export function getPrivateKey(mnemonic) {
  const wallet = ethers.Wallet.fromMnemonic(mnemonic)
  return wallet.privateKey
}
