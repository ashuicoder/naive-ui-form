import { h, resolveComponent, Fragment, ref } from 'vue'
import { TYPE_MAP_COMPONENT } from '../constant'
import {
  NForm,
  NCheckboxGroup,
  NCheckbox,
  NRadioGroup,
  NRadio,
  NDatePicker,
  NTimePicker,
  NFormItemGi,
  NSpace,
  NButton
} from 'naive-ui'

import ImageUpload from '@/components/ImageUpload/src/index.vue'
import { useFormat } from './index'

import type { Slots, Ref } from 'vue'
import type { IFormDescItem, Recordable } from '../types'
import type NaiveUiForm from '../index.vue'
export function useRender(formData: Ref<Recordable>, slots: Slots, emit: InstanceType<typeof NaiveUiForm>['$emit']) {
  const { handlePlaceHolder, handleRule } = useFormat()
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

    if (formDescItem.type === 'upload-image') {
      return (
        <ImageUpload value={formData.value[item]} onUpdate:value={(val) => (formData.value[item] = val)}></ImageUpload>
      )
    }

    return shouldRenderCompenent
  }

  const renderFormItem = (formDescItem: IFormDescItem, item: string) => {
    const formItem = (
      <NFormItemGi
        {...formDescItem.gridItem}
        label={formDescItem.label}
        showLabel={formDescItem.showLabel}
        span={formDescItem.gridItem?.span || 24}
        path={item}
        rule={handleRule(formDescItem)}
      >
        {renderDynamicComponent(formDescItem, item)}
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

  const renderBtn = (props: InstanceType<typeof NaiveUiForm>['$props']) => {
    if (!props.showResetBtn && !props.showSubmitBtn) return null
    return (
      <NFormItemGi showLabel={false} span={24}>
        <NSpace inline={true} justify="center">
          {props.showResetBtn ? (
            <NButton type="primary" onClick={() => handleSubmit()}>
              {props.submitBtnText}
            </NButton>
          ) : null}
          {props.showSubmitBtn ? (
            <NButton type="primary" onClick={() => handleReset()}>
              {props.resetBtnText}
            </NButton>
          ) : null}
        </NSpace>
      </NFormItemGi>
    )
  }

  const handleSubmit = () => {
    formRef.value?.validate((err) => {
      if (err) return
      emit('submit', formData)
    })
  }
  const handleReset = () => {
    formData.value = {}
    formRef.value?.restoreValidation()
  }

  return {
    renderFormItem,
    formRef,
    renderBtn
  }
}
