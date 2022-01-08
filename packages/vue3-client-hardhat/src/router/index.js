import { createRouter, createWebHashHistory } from 'vue-router'
import nProgress from 'nprogress'
import 'nprogress/nprogress.css'

import Layout from '@/layout/index.vue'

nProgress.configure({ showSpinner: false })

const routes = [
  {
    path: '/',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/web3-demo1',
        component: () => import('@/views/web3-demo1.vue'),
        name: 'Web3Demo1',
        meta: {
          title: 'Web3Demo1',
          icon: 'Collection',
        },
      },
      {
        path: '/web3-erc721',
        component: () => import('@/views/web3-erc721.vue'),
        name: 'Web3ERC721',
        meta: {
          title: 'Web3ERC721',
          icon: 'Collection',
        },
      },
    ],
  },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

export { router, routes }
