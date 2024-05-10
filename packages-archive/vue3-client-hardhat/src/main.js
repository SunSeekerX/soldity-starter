import { createApp } from 'vue'
import 'normalize.css/normalize.css'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

import App from './App.vue'
import { router } from '@/router/index'
import ElIcons from '@/components/el-icons/el-icons.vue'

const app = createApp(App)
app.use(router)
app.use(ElementPlus)
app.component('ElIcons', ElIcons)

// Element plus global config
app.config.globalProperties.$ELEMENT = {
  size: 'medium',
}

app.mount('#app')
