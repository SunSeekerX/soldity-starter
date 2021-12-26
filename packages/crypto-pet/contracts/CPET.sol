// 未开源授权标识
// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

// 导入标准的 erc20 代币父合约
import '@openzeppelin/contracts/token/ERC20/ERC20.sol';

// 自定义自己的合约
contract CPET is ERC20 {
  // 固定发行量
  constructor(
    string memory name,
    string memory symbol,
    uint256 initialSupply
  ) ERC20(name, symbol) {
    _mint(msg.sender, initialSupply);
  }
}
