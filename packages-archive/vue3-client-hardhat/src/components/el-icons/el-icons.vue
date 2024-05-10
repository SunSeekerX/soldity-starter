<template>
  <el-icon :size="size" :color="color">
    <component :is="icon"></component>
  </el-icon>
</template>

<script>
import { ref, defineComponent } from 'vue'
import * as Icons from '@element-plus/icons'

export default defineComponent({
  components: Icons,
  name: 'ElIcons',
  props: {
    name: {
      type: String,
      required: true,
    },
    size: {
      type: String,
      default: '',
    },
    color: {
      type: String,
      default: '',
    },
  },
  setup(props) {
    const icon = ref(props.name)
    return {
      icon,
    }
  },
})
</script>
