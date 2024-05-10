# hardhat-starter

## 图书馆 📝

GitHub：https://github.com/AmazingAng/WTF-Solidity

官网：https://www.wtf.academy/

## 多次对同一个状态的合约进行测试

### 部署脚本

```javascript
// scripts/deploy.js
async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);

  const PandoraBox = await ethers.getContractFactory("PandoraBox");
  const pandoraBox = await PandoraBox.deploy();

  console.log("PandoraBox deployed to:", pandoraBox.address);
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
```

### 部署命令

```shell
npx hardhat run scripts/deploy.js --network ganache
```

### 测试脚本

```javascript
// test/pandoraBoxTest.js
const { expect } = require("chai");

describe("PandoraBox contract", function () {
  let pandoraBox;
  let owner;

  before(async function () {
    const address = "这里填入PandoraBox的部署地址";
    const PandoraBox = await ethers.getContractFactory("PandoraBox");
    [owner] = await ethers.getSigners();
    pandoraBox = PandoraBox.attach(address);
  });

  it("Should return the current number", async function () {
    expect(await pandoraBox.num()).to.equal(1);
  });

  it("Should change the number to 20", async function () {
    await pandoraBox.setNum(20);
    expect(await pandoraBox.num()).to.equal(20);
  });
});
```

### 运行测试命令

```shell
npx hardhat test test/pandoraBoxTest.js --network ganache
```

