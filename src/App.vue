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
        <template #text="{ data, key }">
          <input type="text" v-model="data.value[key]" />
        </template>
      </naive-ui-form>

      <button @click="submit">手动提交</button>
      <button>手动重置</button>
    </div>
  </NConfigProvider>
</template>

<script setup lang="tsx">
import { NConfigProvider, zhCN } from 'naive-ui'
import { NaiveUiForm, type Recordable } from '@/components/NForm'
import type { IFormDesc, IFormComponent } from '@/components/NForm'

import { ref } from 'vue'
// import type { IFormDesc, Recordable } from 'naive-ui-form'
// import { NaiveUiForm } from 'naive-ui-form'

const formRef = ref<IFormComponent | null>(null)
const formDesc = ref<IFormDesc>({
  render: {
    type: 'input',
    label: '姓名',
    required: true,
    tip: 'dhksdahfkdshk',
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
