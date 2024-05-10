// SPDX-License-Identifier: UNKNOWN
pragma solidity ^0.8.24;

contract PandoraBox {
  uint256 public num;

  constructor() {
    num = 1;
  }

  function setNum(uint256 v) public {
    num = v;
  }
}
