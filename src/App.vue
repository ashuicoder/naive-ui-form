<template>
  <NConfigProvider :locale="zhCN">
    <div style="padding: 20px">
      <naive-ui-form
        ref="formRef"
        :form-desc="formDesc"
        v-model:value="formData"
        labelPlacement="left"
        @submit="handleSubmit"
      >
      </naive-ui-form>

      <button @click="submit">手动提交</button>
      <button>手动重置</button>
    </div>
  </NConfigProvider>
</template>

<script setup lang="tsx">
import { ref } from 'vue'
import { NConfigProvider, zhCN } from 'naive-ui'
import { NaiveUiForm } from '@/components/NForm'
import type { IFormDesc, IFormComponent, Recordable } from '@/components/NForm'

// import type { IFormDesc, Recordable, IFormComponent } from 'naive-ui-form'
// import { NaiveUiForm } from 'naive-ui-form'

const formRef = ref<IFormComponent | null>(null)
const formDesc = ref<IFormDesc>({
  render: {
    type: 'input',
    label: '姓名',
    required: true,
    tip: '2222',
    gridItem: {
      span: 12
    }
  },
  slot: {
    type: 'input',
    label: '笔记',
    tip: '提示啊',
    gridItem: {
      span: 12
    }
  }
})

const formData = ref<Recordable>({})

const handleSubmit = () => {
  console.log('submit')
}

const submit = () => {
  formRef.value?.reset()
}
</script>

<style scoped></style>
