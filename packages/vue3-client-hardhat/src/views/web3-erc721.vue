<template>
  <!-- 页面标题 -->
  <el-row class="mb-12">
    <h1>ERC721 测试</h1>
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

<script setup name="Web3ERC721">
import detectEthereumProvider from '@metamask/detect-provider'
import Web3 from 'web3/dist/web3.min.js'
import { isNil, isEmpty } from 'lodash'

import { $modal, $eth } from '@/combin'

/**
 * Data
 */
// 连接的小狐狸账号
const accounts = ref([])
// erc721 合约地址
const erc721ContractAddress = ref(null)
// erc721 合约 abi
const erc721ContractAbi = ref(null)
// 输入的 erc721 合约地址
const inputErc721ContractAddress = ref(null)
// 输入的 erc721 合约 abi
const inputErc721ContractAbi = ref(null)
// erc721 合约对象
const erc721ContractObj = ref(null)
// 交易记录
const transactionList = ref([])

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
