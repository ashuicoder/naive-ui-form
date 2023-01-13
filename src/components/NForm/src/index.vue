<script lang="tsx">
import { defineComponent, computed, ref, Fragment, resolveComponent, h, defineExpose } from 'vue'

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
  NButton,
  NSpace,
  NText
} from 'naive-ui'

import { GLOBAL_NAME, PLACEHOLDER_TYPE, TYPE_MAP_COMPONENT } from './constant'

import type { NGrid as IGrid } from 'naive-ui'
import type { IFormDesc, Recordable, IType, IFormDescItem } from './types'
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
    NGrid,
    NGridItem,
    NSpace,
    NText
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

    requireMarkPlacement: {
      type: String as PropType<'left' | 'right' | 'right-hanging'>,
      default: 'right'
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
      return formData
    },
    reset() {
      return true
    }
  },
  setup(props, { slots, emit, expose }) {
    const formData = computed({
      get() {
        return props.value
      },
      set(val) {
        emit('update:value', val)
      }
    })
    const formRef = ref<InstanceType<typeof NForm> | null>(null)

    const renderDynamicComponent = (formDescItem: IFormDescItem, item: string) => {
      if (typeof formDescItem.render === 'function') {
        return formDescItem.render(formData, item)
      }
      if (formDescItem.slot) {
        return (
          <Fragment>
            {slots[formDescItem.slot]!({
              data: formData,
              key: item
            })}
          </Fragment>
        )
      }

      if (formDescItem.type === 'checkbox') {
        return (
          <NCheckboxGroup v-model:value={formData.value[item]} {...formDescItem.props}>
            {formDescItem.options?.map((option) => {
              return <NCheckbox {...option} />
            })}
          </NCheckboxGroup>
        )
      }

      if (formDescItem.type === 'radio') {
        return (
          <NRadioGroup v-model:value={formData.value[item]} {...formDescItem.props}>
            {formDescItem.options?.map((option) => {
              return <NRadio {...option} />
            })}
          </NRadioGroup>
        )
      }

      const DynamicComponent = resolveComponent(TYPE_MAP_COMPONENT[formDescItem.type].name)
      const shouldRenderCompenent = h(DynamicComponent, {
        value: formData.value[item],
        onUpdateValue: (value: any) => {
          formData.value[item] = value
        },
        ...formDescItem.props,
        placeholder: formDescItem.props?.placeholder ?? handlePlaceHolder(formDescItem)
      })

      if (formDescItem.type === 'date-picker') {
        if (!formDescItem.props || (!formDescItem.props['value-format'] && !formDescItem.props['valueFormat'])) {
          return shouldRenderCompenent
        }
        return <NDatePicker v-model:formatted-value={formData.value[item]} {...formDescItem.props}></NDatePicker>
      }

      if (formDescItem.type === 'time-picker') {
        if (!formDescItem.props || (!formDescItem.props['value-format'] && !formDescItem.props['valueFormat'])) {
          return shouldRenderCompenent
        }
        return <NTimePicker v-model:formatted-value={formData.value[item]} {...formDescItem.props}></NTimePicker>
      }

      // if (formDescItem.type === 'upload-image') {
      //   return (
      //     <ImageUpload value={formData.value[item]} onUpdate:value={(val) => (formData.value[item] = val)}></ImageUpload>
      //   )
      // }

      return shouldRenderCompenent
    }
    const renderFormItem = (formDescItem: IFormDescItem, item: string) => {
      const formItem = (
        <NFormItemGi
          {...formDescItem.gridItem}
          label={formDescItem.label}
          showLabel={formDescItem.showLabel}
          span={handleSpan(formDescItem)}
          {...formDescItem.gridItem}
          path={item}
          rule={handleRule(formDescItem)}
        >
          <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
            <div style={{ flex: 1, minWidth: '0px' }}>{renderDynamicComponent(formDescItem, item)}</div>
            {formDescItem.tip ? (
              <div>
                <NText type="warning" style={{ marginLeft: '8px' }}>
                  {formDescItem.tip}
                </NText>
              </div>
            ) : null}
          </div>
        </NFormItemGi>
      )

      if (!Reflect.has(formDescItem, 'vif')) {
        return formItem
      }
      if (typeof formDescItem.vif !== 'function') {
        console.error(`vif must be a function in ${formDescItem.type}, use "(formData) => boolean"`)
        return null
      }
      if (formDescItem.vif(formData.value)) {
        return formItem
      }
      return null
    }
    const renderBtn = () => {
      if (!props.showResetBtn && !props.showSubmitBtn) return null
      return (
        <NFormItemGi showLabel={false} span={24}>
          <NSpace inline={true} justify="center">
            {props.showResetBtn ? (
              <NButton type="primary" onClick={() => submit()}>
                {props.submitBtnText}
              </NButton>
            ) : null}
            {props.showSubmitBtn ? (
              <NButton type="primary" onClick={() => reset()}>
                {props.resetBtnText}
              </NButton>
            ) : null}
          </NSpace>
        </NFormItemGi>
      )
    }

    const getCommonText = (type: IType) => {
      return PLACEHOLDER_TYPE[TYPE_MAP_COMPONENT[type].placeholder]
    }
    const handleRule = (formDescItem: IFormDescItem) => {
      const message = getCommonText(formDescItem.type)
      if (formDescItem.required) {
        return {
          required: true,
          message: `请${message}${formDescItem.label}`
        }
      }

      if (formDescItem.rule) return formDescItem.rule

      return {}
    }

    const handlePlaceHolder = (formDescItem: IFormDescItem) => {
      if (!formDescItem.props?.placeholder) {
        const placeholder = getCommonText(formDescItem.type)
        return `请${placeholder}${formDescItem.label || ''}`
      }
    }
    const handleSpan = (formDescItem: IFormDescItem) => {
      if (formDescItem.gridItem?.span) {
        return formDescItem.gridItem?.span
      }
      if (props.inline) return 6
      return 24
    }
    const submit = () => {
      formRef.value?.validate((err) => {
        if (err) return
        emit('submit', formData)
      })
    }
    const reset = () => {
      formData.value = {}
      formRef.value?.restoreValidation()
      emit('reset')
    }

    expose({
      submit,
      reset
    })
    return () => {
      return (
        <NForm
          model={formData.value}
          ref={formRef}
          size={props.size}
          disabled={props.disabled}
          inline={props.inline}
          labelWidth={props.labelWidth}
          labelAlign={props.labelAlign}
          labelPlacement={props.labelPlacement}
          requireMarkPlacement={props.requireMarkPlacement}
        >
          <NGrid {...props.grid}>
            {Object.keys(props.formDesc).map((item) => {
              return renderFormItem(props.formDesc[item], item)
            })}
            {renderBtn()}
          </NGrid>
        </NForm>
      )
    }
  }
})
</script>

<style scoped></style>
