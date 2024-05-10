import { defineConfig, loadEnv } from 'vite'
import path from 'path'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
// import Components from 'unplugin-vue-components/vite'
// import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

export default defineConfig(({ mode, command }) => {
  const env = loadEnv(mode, process.cwd())
  return {
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
      },
    },
    plugins: [
      vue(),
      AutoImport({
        // 转化目标
        include: [
          /\.[tj]sx?$/, // .ts, .tsx, .js, .jsx
          /\.vue$/,
          /\.vue\?vue/, // .vue
          /\.md$/, // .md
        ],
        // 全局导入注册
        imports: [
          'vue',
          'vue-router',
          {
            vuex: ['useStore'],
          },
        ],
        dts: './src/auto-imports.d.ts',
        // resolvers: [ElementPlusResolver()],
      }),
      // Components({
      //   /* options */
      //   dts: './src/auto-components.d.ts',
      //   resolvers: [ElementPlusResolver()],
      // }),
    ],
  }
})
