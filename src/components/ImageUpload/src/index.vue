<template>
  <NUpload v-model:file-list="fileList" list-type="image-card"></NUpload>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { NUpload } from 'naive-ui'
import type { UploadFileInfo } from 'naive-ui'

type IValue = UploadFileInfo[] | undefined
const props = defineProps<{
  value: IValue
}>()

const emits = defineEmits<{
  (e: 'update:value', value: IValue): void
}>()
const fileList = computed({
  get() {
    return props.value
  },
  set(val) {
    emits('update:value', val)
  }
})
</script>

<style scoped></style>
