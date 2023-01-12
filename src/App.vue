<template>
  <NConfigProvider :locale="zhCN">
    <div style="padding: 20px">
      <naive-ui-form :form-desc="formDesc" v-model:value="formData" @submit="handleSubmit">
        <template #text="{ data, key }">
          <input type="text" v-model="data.value[key]" />
        </template>
      </naive-ui-form>
    </div>
  </NConfigProvider>
</template>

<script setup lang="tsx">
import { NConfigProvider, zhCN } from 'naive-ui'
import { NaiveUiForm, type Recordable } from '@/components/NForm'
import type { IFormDesc } from '@/components/NForm'

import { ref } from 'vue'

const formDesc = ref<IFormDesc>({
  render: {
    type: 'input',
    label: '姓名',
    required: true,
    render(data, key) {
      return <input v-model={data.value[key]} />
    }
  },
  slot: {
    type: 'input',
    label: '笔记',
    slot: 'text'
  }
})

const formData = ref<Recordable>({})

const handleSubmit = () => {
  console.log('submit')
}
</script>

<style scoped></style>
