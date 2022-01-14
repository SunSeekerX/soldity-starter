<template>
  <!-- 页面标题 -->
  <el-row class="mb-12">
    <h1>Web3ShangShui 测试</h1>
  </el-row>

  <el-row class="mb-12"> 当前的ERC721合约地址： {{ erc721ContractAddress || '请设置合约地址' }}</el-row>

  <!-- 设置合约地址和 abi -->
  <el-row class="mb-12" :gutter="5">
    <el-col :span="12">
      <el-input v-model="inputErc721ContractAddress" placeholder="请输入部署的合约的地址" />
    </el-col>
    <el-col :span="6">
      <el-button @click="handleSetContractAddress" type="primary">设置合约地址</el-button>
    </el-col>
  </el-row>
  <el-row class="mb-12" :gutter="5">
    <el-col :span="12">
      <el-input v-model="inputErc721ContractAbi" type="textarea" placeholder="请输入部署合约的 abi" />
    </el-col>
    <el-col :span="6">
      <el-button @click="handleSetContractAbi" type="primary">设置合约abi</el-button>
    </el-col>
  </el-row>
  <el-row class="mb-12" :gutter="5">
    <el-col :span="12"> 当前的合约对象地址： {{ erc721ContractObj?._address || '请初始化合约对象' }} </el-col>
    <el-col :span="6">
      <el-button :disabled="isDisableInitContractIbj" @click="handleInitContractObj" type="primary">
        初始化合约对象
      </el-button>
    </el-col>
  </el-row>

  <!-- 账户信息 -->
  <el-row class="mb-12">
    <el-card class="box-card">
      <template #header>
        <div class="card-header">
          <span>账户信息</span>
          <el-button @click="handleOpenMateMask" type="primary">获取小狐狸账号</el-button>
        </div>
      </template>

      <template v-if="accounts && accounts.length">
        <div v-for="(account, index) of accounts" :key="account" class="text item">{{
          `账号${index}：${account}`
        }}</div>
      </template>
      <el-empty v-else description="暂无账号"></el-empty>
    </el-card>
  </el-row>

  <!-- 交互 -->
  <el-row class="mb-12">
    <h2>交互</h2>
  </el-row>
  <!-- Mint -->
  <el-row class="mb-12" :gutter="5">
    <el-form label-position="Left" label-width="100px" :model="formMint" style="max-width: 460px">
      <el-form-item label="Mint to">
        <el-input v-model="formMint.mintToAddress"></el-input>
      </el-form-item>
      <el-form-item label="uri">
        <el-input v-model="formMint.mintUri"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button :disabled="isDisableMint" @click="handleMint" type="primary">Mint</el-button>
      </el-form-item>
    </el-form>
  </el-row>
  <!-- 获取 nft  -->
  <el-row class="mb-12" :gutter="5">
    <!-- <el-button @click="handleGetNft" type="primary">GetNft</el-button> -->

    <!-- 获取我的 nft  -->
    <el-button @click="handleGetMyNfts" type="primary">GetMyNfts</el-button>

    <!-- 获取总发行 -->
    <el-button @click="handleGetTotalSupply" type="primary">GetTotalSupply</el-button>

    <!-- 获取 token uri -->
    <el-button @click="handleGetTokenURI" type="primary">GetTokenURI</el-button>
  </el-row>

  <!-- 交易记录 -->
  <el-row class="mb-12">
    <el-table :data="transactionList" style="width: 100%">
      <el-table-column prop="name" label="交易名称" />
      <el-table-column prop="transaction.transactionHash" label="交易 hash" />
      <el-table-column prop="transaction.blockHash" label="块 hash" />
      <el-table-column prop="transaction.from" label="From" />
      <el-table-column prop="transaction.to" label="To" />
    </el-table>
  </el-row>
</template>

<script setup name="Web3ShangShui">
import detectEthereumProvider from '@metamask/detect-provider'
import Web3 from 'web3/dist/web3.min.js'
import { isNil, isEmpty } from 'lodash'
import * as ethers from 'ethers'
import axios from 'axios'

import { $modal, $eth } from '@/combin'

/**
 * Data
 */
// 连接的小狐狸账号
const accounts = ref([])
// erc721 合约地址
const erc721ContractAddress = ref('0x003D14603F8D610210932729CF42A8692bcf5ce3')
// erc721 合约 abi
// const erc721ContractAbi = ref(null)
const erc721ContractAbi = ref([
  {
    inputs: [],
    stateMutability: 'nonpayable',
    type: 'constructor',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'owner',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'approved',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'uint256',
        name: 'tokenId',
        type: 'uint256',
      },
    ],
    name: 'Approval',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'owner',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'operator',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'bool',
        name: 'approved',
        type: 'bool',
      },
    ],
    name: 'ApprovalForAll',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'previousOwner',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'newOwner',
        type: 'address',
      },
    ],
    name: 'OwnershipTransferred',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'address',
        name: 'account',
        type: 'address',
      },
    ],
    name: 'Paused',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'from',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'to',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'uint256',
        name: 'tokenId',
        type: 'uint256',
      },
    ],
    name: 'Transfer',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'address',
        name: 'account',
        type: 'address',
      },
    ],
    name: 'Unpaused',
    type: 'event',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'to',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'tokenId',
        type: 'uint256',
      },
    ],
    name: 'approve',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'owner',
        type: 'address',
      },
    ],
    name: 'balanceOf',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'tokenId',
        type: 'uint256',
      },
    ],
    name: 'burn',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'tokenId',
        type: 'uint256',
      },
    ],
    name: 'getApproved',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'owner',
        type: 'address',
      },
      {
        internalType: 'address',
        name: 'operator',
        type: 'address',
      },
    ],
    name: 'isApprovedForAll',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'name',
    outputs: [
      {
        internalType: 'string',
        name: '',
        type: 'string',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'owner',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'tokenId',
        type: 'uint256',
      },
    ],
    name: 'ownerOf',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'pause',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'paused',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'renounceOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'to',
        type: 'address',
      },
      {
        internalType: 'string',
        name: 'uri',
        type: 'string',
      },
    ],
    name: 'safeMint',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'from',
        type: 'address',
      },
      {
        internalType: 'address',
        name: 'to',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'tokenId',
        type: 'uint256',
      },
    ],
    name: 'safeTransferFrom',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'from',
        type: 'address',
      },
      {
        internalType: 'address',
        name: 'to',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'tokenId',
        type: 'uint256',
      },
      {
        internalType: 'bytes',
        name: '_data',
        type: 'bytes',
      },
    ],
    name: 'safeTransferFrom',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'operator',
        type: 'address',
      },
      {
        internalType: 'bool',
        name: 'approved',
        type: 'bool',
      },
    ],
    name: 'setApprovalForAll',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'bytes4',
        name: 'interfaceId',
        type: 'bytes4',
      },
    ],
    name: 'supportsInterface',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'symbol',
    outputs: [
      {
        internalType: 'string',
        name: '',
        type: 'string',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'index',
        type: 'uint256',
      },
    ],
    name: 'tokenByIndex',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'owner',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'index',
        type: 'uint256',
      },
    ],
    name: 'tokenOfOwnerByIndex',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'tokenId',
        type: 'uint256',
      },
    ],
    name: 'tokenURI',
    outputs: [
      {
        internalType: 'string',
        name: '',
        type: 'string',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'totalSupply',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'from',
        type: 'address',
      },
      {
        internalType: 'address',
        name: 'to',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'tokenId',
        type: 'uint256',
      },
    ],
    name: 'transferFrom',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'newOwner',
        type: 'address',
      },
    ],
    name: 'transferOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'unpause',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
])
// 输入的 erc721 合约地址
const inputErc721ContractAddress = ref(null)
// 输入的 erc721 合约 abi
const inputErc721ContractAbi = ref(null)
// erc721 合约对象
const erc721ContractObj = ref(null)
// 交易记录
const transactionList = ref([])

// erc721 token ids
const ids = ref([])

// Form mint
const formMint = ref({
  mintToAddress: '',
  mintUri: '',
})

/**
 * Computed
 */
const isDisableInitContractIbj = computed(() => {
  if ($eth.isValidAddress(erc721ContractAddress.value) && !isNil(erc721ContractAbi.value)) {
    return false
  } else {
    return true
  }
})
const isDisableMint = computed(() => {
  const { mintToAddress, mintUri } = formMint.value
  if (!isNil(erc721ContractObj.value) && $eth.isValidAddress(mintToAddress) && !isEmpty(mintUri)) {
    return false
  } else {
    return true
  }
})

// 获取小狐狸账号
async function handleOpenMateMask() {
  window.ethereum
    .request({ method: 'eth_requestAccounts' })
    .then((res) => {
      accounts.value = res
      $modal.msgSuccess('获取账号成功')
    })
    .catch((error) => {
      if (error.code === 4001) {
        $modal.msgError('用户拒绝请求')
      } else {
        $modal.msgError(error)
      }
      console.error(error)
    })
}
// 设置合约地址
function handleSetContractAddress() {
  if ($eth.isValidAddress(inputErc721ContractAddress.value)) {
    erc721ContractAddress.value = inputErc721ContractAddress.value
    $modal.msgSuccess('设置合约地址成功')
  } else {
    $modal.msgWarning('请输入正确的合约地址')
  }
}
// 设置合约 abi
function handleSetContractAbi() {
  if (isEmpty(inputErc721ContractAbi.value)) {
    return $modal.msgWarning('请输入正确的合约 abi')
  }
  erc721ContractAbi.value = JSON.parse(inputErc721ContractAbi.value)
  $modal.msgSuccess('设置合约 abi 成功')
}
// 初始化合约对象
async function handleInitContractObj() {
  console.log(erc721ContractAbi.value)
  const provider = await detectEthereumProvider()
  const web3 = new Web3(provider)
  erc721ContractObj.value = new web3.eth.Contract(erc721ContractAbi.value, erc721ContractAddress.value)
  $modal.msgSuccess(`创建交互合约对象成功`)
  console.log('erc721ContractObj', erc721ContractObj.value)
}

/**
 * 合约交互
 */
async function handleMint() {
  const { mintToAddress, mintUri } = formMint.value
  const fromAddress = accounts.value[0]

  const transactionRes = await erc721ContractObj.value.methods
    .safeMint(mintToAddress, mintUri)
    .send({ from: fromAddress })
  console.log('transactionRes', transactionRes)
  if (transactionRes.transactionHash) {
    $modal.msgSuccess(`铸造成功: ${transactionRes.transactionHash}`)
    transactionList.value.push({
      name: '设置值',
      transaction: transactionRes,
    })
  } else {
    $modal.msgError('交易失败')
  }
}

// async function handleGetNft(){
//   const res =
// }

async function listTokensOfOwner({ token: tokenAddress, account, abi }) {
  const token = await ethers.getContractAt(abi, tokenAddress, ethers.provider)

  console.error(await token.name(), 'tokens owned by', account)

  const sentLogs = await token.queryFilter(token.filters.Transfer(account, null))
  const receivedLogs = await token.queryFilter(token.filters.Transfer(null, account))

  const logs = sentLogs
    .concat(receivedLogs)
    .sort((a, b) => a.blockNumber - b.blockNumber || a.transactionIndex - b.TransactionIndex)

  const owned = new Set()

  for (const log of logs) {
    const { from, to, tokenId } = log.args

    if (addressEqual(to, account)) {
      owned.add(tokenId.toString())
    } else if (addressEqual(from, account)) {
      owned.delete(tokenId.toString())
    }
  }

  console.log([...owned].join('\n'))
}
async function handleGetMyNfts() {
  const myAccounts = accounts.value[0]
  // const res = await erc721ContractObj.value.methods.balanceOf(myAccounts).call()

  await erc721ContractObj.value
    .getPastEvents('Transfer', {
      filter: {
        _from: myAccounts,
      },
      fromBlock: 0,
    })
    .then((events) => {
      const myTokenIds = []
      for (const event of events) {
        if (event.type === 'mined') {
          myTokenIds.push(event.returnValues.tokenId)
        }
      }
      ids.value = myTokenIds

      if (myTokenIds.length > 0) {
        $modal.msgWarning(`${myAccounts} 有 ${myTokenIds.length} 个 nft`)
        getMetaUri()
      } else {
        $modal.msgWarning(`${myAccounts} 无 nft`)
      }
    })
}

async function getMetaUri() {
  const idsList = ids.value
  const nftsInfo = []
  for (const id of idsList) {
    const uri = await erc721ContractObj.value.methods.tokenURI(id).call()
    const nftInfo = await axios.get(`${res}.json`)
    console.log(nftInfo);
  }
}

// 获取总发行
async function handleGetTotalSupply() {
  const res = await erc721ContractObj.value.methods.totalSupply().call()
  console.log(res)
}

// 获取 token 的 uri
async function handleGetTokenURI() {
  const res = await erc721ContractObj.value.methods.tokenURI().call()
  console.log(res)
}
</script>

<style>
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.text {
  font-size: 14px;
}

.item {
  margin-bottom: 18px;
}

.box-card {
  width: 480px;
}
.mb-12 {
  margin-bottom: 12px;
}
</style>
