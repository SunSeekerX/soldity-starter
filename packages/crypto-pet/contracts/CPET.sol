// 未开源授权标识
// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

// 导入标准的 erc20 代币父合约
import '@openzeppelin/contracts/token/ERC20/ERC20.sol';

// 自定义自己的合约
contract CPET is ERC20 {
  // 代币名
  string public constant NAME = 'Crypto Pet';
  // 代币符号
  string public constant SYMBOL = 'CPET';
  // 代币精度
  uint8 public constant DECIMALS = 6;
  // 初始供应量
  uint256 public constant INITIAL_SUPPLY = 100000000 * (10**uint256(DECIMALS));

  // 固定发行量
  constructor() ERC20(NAME, SYMBOL) {
    _mint(msg.sender, INITIAL_SUPPLY);
  }
}
