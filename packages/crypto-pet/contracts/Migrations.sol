// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

contract Migrations {
  address public owner;
  uint256 public last_completed_migration;

  modifier restricted() {
    if (msg.sender == owner) _;
  }

  constructor() {
    owner = msg.sender;
  }

  function setCompleted(uint256 completed) public restricted {
    last_completed_migration = completed;
  }

  // https://learnblockchain.cn/docs/truffle/getting-started/running-migrations.html 
  // 复制的，看起来像升级合约的函数
  function upgrade(address new_address) public restricted {
    Migrations upgraded = Migrations(new_address);
    upgraded.setCompleted(last_completed_migration);
  }
}
