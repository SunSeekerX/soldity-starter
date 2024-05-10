<template>
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

  <!-- 保存 -->
  <el-row class="mb-12" :gutter="5">
    <el-col :span="12">
      <el-input v-model="inputData" placeholder="输入保存的值" />
    </el-col>
    <el-col :span="12">
      <el-button @click="handleSave" type="primary">保存输入的值</el-button>
    </el-col>
  </el-row>

  <!-- 读取 -->
  <el-row class="mb-12" :gutter="5">
    <el-col :span="12">
      <el-input disabled v-model="savedValue" placeholder="获取输入的值" />
    </el-col>
    <el-col :span="12">
      <el-button @click="handleGetSavedValue" type="primary">获取输入的值</el-button>
    </el-col>
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

<script setup name="Web3Demo1">
import detectEthereumProvider from '@metamask/detect-provider'
import Web3 from 'web3/dist/web3.min.js'
import { isNil } from 'lodash'

import { $modal, $eth } from '@/combin'

// 合约 abi
const contractAbi = [
  {
    inputs: [
      {
        internalType: 'string',
        name: '_greeting',
        type: 'string',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'constructor',
  },
  {
    inputs: [],
    name: 'greet',
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
        internalType: 'string',
        name: '_greeting',
        type: 'string',
      },
    ],
    name: 'setGreeting',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
]
// 合约地址
const contractAddress = '0x366BcE300114e6872cf8C2c67621594C63EEcab9'

/**
 * Data
 */
// 连接的小狐狸账号
const accounts = ref([])
// 合约代码
const contract = ref(null)
// 输入的值
const inputData = ref(null)
// 保存的值
const savedValue = ref(null)
// 交易记录
const transactionList = ref([])

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
// 保存输入值
async function handleSave() {
  // 检查地址
  const fromAddress = accounts.value[0]
  if (isNil(fromAddress)) {
    return $modal.msgWarning('请先连接钱包')
  }
  // 检查输入的值
  if (isNil(inputData.value)) {
    return $modal.msgWarning('请输入值')
  }

  const transactionRes = await contract.value.methods.setGreeting(inputData.value).send({ from: fromAddress })
  console.log('transactionRes', transactionRes)
  if (transactionRes.transactionHash) {
    $modal.msgSuccess(`交易成功: ${transactionRes.transactionHash}`)
    transactionList.value.push({
      name: '设置值',
      transaction: transactionRes,
    })
  } else {
    $modal.msgError('交易失败')
  }
}
// 获取输入的值
async function handleGetSavedValue() {
  // 检查地址
  const fromAddress = accounts.value[0]
  if (isNil(fromAddress)) {
    return $modal.msgWarning('请先连接钱包')
  }

  savedValue.value = await contract.value.methods.greet().call()
  console.log('getGreet', savedValue.value)

  $modal.msgSuccess(`获取成功: ${savedValue.value}`)
}

// 检查输入
async function onLoadCheck() {
  return new Promise((resolve, reject) => {
    if (isNil(contractAbi)) {
      $modal.msgWarning('请输入合约 abi')
      reject()
    } else if (!$eth.isValidAddress(contractAddress)) {
      $modal.msgWarning('请输入合约地址')
      reject()
    } else {
      resolve()
    }
  })
}

// onload
async function onLoad() {
  try {
    const res = await onLoadCheck()
    console.log(res)
    const provider = await detectEthereumProvider()
    const web3 = new Web3(provider)
    contract.value = new web3.eth.Contract(contractAbi, contractAddress)
    $modal.msgSuccess(`创建交互合约对象成功`)
    console.log('contract', contract.value)
  } catch (error) {
    console.log(error)
  }
}

// Load
onLoad()
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
