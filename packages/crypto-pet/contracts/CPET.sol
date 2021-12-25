// 未开源授权标识
// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

// 导入标准的 erc20 代币父合约
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

// 自定义自己的合约
contract CPET is ERC20 {
    // constructor(uint256 initialSupply) ERC20("Crypto Pet", "CPET") {
    //     _mint(msg.sender, initialSupply);
    // }
    // 固定发行量
    constructor() ERC20("Crypto Pet", "CPET") {
        _mint(msg.sender, 1000000000);
    }
}
