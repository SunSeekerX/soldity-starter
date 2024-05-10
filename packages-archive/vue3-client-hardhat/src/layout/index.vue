<template>
  <el-container style="height: 100vh; border: 1px solid #eee">
    <el-aside style="width: 200px; background-color: rgb(238, 241, 246)">
      <el-menu router>
        <el-menu-item v-for="(item, index) of routeList" :key="item.path" :index="String(index)" :route="item">
          <el-icons :name="item.meta.icon" />
          <span>{{ item.meta.title }}</span>
        </el-menu-item>
      </el-menu>
    </el-aside>

    <el-container>
      <!-- <el-header style="text-align: right; font-size: 12px">
        <el-dropdown>
          <el-icon style="margin-right: 15px"><setting /></el-icon>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item>View</el-dropdown-item>
              <el-dropdown-item>Add</el-dropdown-item>
              <el-dropdown-item>Delete</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
        <span>Tom</span>
      </el-header> -->

      <el-main>
        <router-view />
        <!-- <el-table :data="tableData">
          <el-table-column prop="date" label="Date" width="140"> </el-table-column>
          <el-table-column prop="name" label="Name" width="120"> </el-table-column>
          <el-table-column prop="address" label="Address"> </el-table-column>
        </el-table> -->
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup name="AppLayout">
import { useRouter } from 'vue-router'

import { routes } from '@/router'

const router = useRouter()
const routeList = []
for (const item of routes[0].children) {
  if (item.hidden !== true) {
    routeList.push(item)
  }
}
</script>

<style>
.el-header {
  background-color: #b3c0d1;
  color: var(--el-text-color-primary);
  line-height: 60px;
}

.el-aside {
  color: var(--el-text-color-primary);
}
</style>
