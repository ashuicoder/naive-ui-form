<script lang="tsx">
import { defineComponent, computed } from 'vue'

import {
  NAutoComplete,
  NCascader,
  NColorPicker,
  NCheckbox,
  NCheckboxGroup,
  NDatePicker,
  NDynamicInput,
  NDynamicTags,
  NInput,
  NInputNumber,
  NMention,
  NRadio,
  NRadioGroup,
  NRate,
  NSelect,
  NSlider,
  NSwitch,
  NTimePicker,
  NTransfer,
  NTreeSelect,
  NUpload,
  NForm,
  NFormItemGi,
  NGrid,
  NGridItem,
  NButton
} from 'naive-ui'

import { GLOBAL_NAME } from './constant'
import { useRender } from './hooks'

import type { NGrid as IGrid } from 'naive-ui'
import type { IFormDesc, Recordable } from './types'
import type { PropType } from 'vue'

export default defineComponent({
  name: GLOBAL_NAME,
  components: {
    NAutoComplete,
    NCascader,
    NColorPicker,
    NCheckbox,
    NCheckboxGroup,
    NDatePicker,
    NDynamicInput,
    NDynamicTags,
    NInput,
    NInputNumber,
    NMention,
    NRadio,
    NRadioGroup,
    NRate,
    NSelect,
    NSlider,
    NSwitch,
    NTimePicker,
    NTransfer,
    NTreeSelect,
    NUpload,
    NForm,
    NFormItemGi,
    NGrid,
    NGridItem,
    NButton
  },
  props: {
    value: {
      type: Object as PropType<Recordable>,
      required: true
    },
    formDesc: {
      type: Object as PropType<IFormDesc>,
      required: true
    },
    grid: {
      type: Object as PropType<InstanceType<typeof IGrid>['$props']>,
      default: () => ({
        cols: 24,
        collapsed: false,
        xGap: 0,
        yGap: 0
      })
    },
    disabled: {
      type: Boolean,
      default: false
    },
    inline: {
      type: Boolean,
      default: false
    },
    labelWidth: {
      type: [Number, String],
      default: 'auto'
    },
    labelAlign: {
      type: String as PropType<'left' | 'right'>,
      default: 'right'
    },
    labelPlacement: {
      type: String as PropType<'left' | 'top'>,
      default: 'top'
    },
    size: {
      type: String as PropType<'small' | 'medium' | 'large'>,
      default: 'medium'
    },

    showSubmitBtn: {
      type: Boolean,
      default: true
    },
    submitBtnText: {
      type: String,
      default: '提交'
    },
    showResetBtn: {
      type: Boolean,
      default: true
    },
    resetBtnText: {
      type: String,
      default: '重置'
    }
  },

  emits: {
    'update:value': (formData: Recordable) => {
      return Boolean(formData)
    },
    submit: (formData: Recordable) => {
      return Boolean(formData)
    }
  },
  setup(props, { slots, emit }) {
    const formData = computed({
      get() {
        return props.value
      },
      set(val) {
        emit('update:value', val)
      }
    })
    const { renderFormItem, formRef, renderBtn } = useRender(formData, slots, emit)
    return () => {
      return (
        <NForm model={formData.value} ref={formRef} size={props.size} disabled={props.disabled}>
          <NGrid {...props.grid}>
            {Object.keys(props.formDesc).map((item) => {
              return renderFormItem(props.formDesc[item], item)
            })}
            {renderBtn(props)}
          </NGrid>
        </NForm>
      )
    }
  }
})
</script>

<style scoped></style>
