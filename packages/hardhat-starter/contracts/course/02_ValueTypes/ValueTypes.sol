// SPDX-License-Identifier: UNKNOWN
pragma solidity ^0.8.24;

contract ValueTypes {
  // Solidity中的变量类型
  /**
   * 值类型(Value Type)：包括布尔型，整数型等等，这类变量赋值时候直接传递数值。
   * 引用类型(Reference Type)：包括数组和结构体，这类变量占空间大，赋值时候直接传递地址（类似指针）。
   * 映射类型(Mapping Type): Solidity中存储键值对的数据结构，可以理解为哈希表
   */
  // 布尔值
  bool public _bool = true;
  // 整型, 整型是 Solidity 中的整数，最常用的包括：
  int public _int = -1; // 整数，包括负数
  uint public _uint = 1; // 正整数
  uint256 public _number = 20220330; // 256位正整数
  /**
   * 地址类型，地址类型(address)有两类：
   * 普通地址（address）: 存储一个 20 字节的值（以太坊地址的大小）。
   * payable address: 比普通地址多了 transfer 和 send 两个成员方法，用于接收转账。
   */
  address public _address = 0x7A58c0Be72BE218B41C608b7Fe7C5bB630736C71;
  address payable public _address1 = payable(_address); // payable address，可以转账、查余额
  // 地址类型的成员
  uint256 public balance = _address1.balance; // balance of address
  /**
   * 字节数组分为定长和不定长两种：
   * 定长字节数组: 属于值类型，数组长度在声明之后不能改变。根据字节数组的长度分为 bytes1, bytes8, bytes32 等类型。定长字节数组最多存储 32 bytes 数据，即bytes32。
   * 不定长字节数组: 属于引用类型（之后的章节介绍），数组长度在声明之后可以改变，包括 bytes 等。
   */
  // 固定长度的字节数组
  bytes32 public _byte32 = 'MiniSolidity';
  bytes1 public _byte = _byte32[0];
  /**
   * 枚举 enum
   * 枚举（enum）是 Solidity 中用户定义的数据类型。它主要用于为 uint 分配名称，使程序易于阅读和维护。它与 C 语言 中的 enum 类似，使用名称来代替从 0 开始的 uint：
   * enum 是一个比较冷门的变量，几乎没什么人用。
   */
  // 用enum将uint 0， 1， 2表示为Buy, Hold, Sell
  enum ActionSet {
    Buy,
    Hold,
    Sell
  }
  // 创建enum变量 action
  ActionSet action = ActionSet.Buy;

  // enum可以和uint显式的转换
  function enumToUint() external view returns (uint) {
    return uint(action);
  }
}
