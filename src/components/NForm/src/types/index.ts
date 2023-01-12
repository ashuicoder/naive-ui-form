import type { TYPE_MAP_COMPONENT } from '../constant'
import type { FormItemRule, NGridItem } from 'naive-ui'
import type { Ref, VNode } from 'vue'
export type IType = keyof typeof TYPE_MAP_COMPONENT
export type Recordable = Record<string, any>
export interface IFormItemOption {
  label: string
  value: string | number
  disabled?: boolean
}

export interface IFormDescItem {
  type: IType
  showLabel?: boolean
  label?: string
  tip?: string
  required?: boolean
  rule?: FormItemRule | FormItemRule[]
  props?: Recordable
  gridItem?: InstanceType<typeof NGridItem>['$props']
  options?: IFormItemOption[]
  vif?: (formData: Recordable) => boolean
  render?: (formData: Ref<Recordable>, key: string) => VNode
  slot?: string
}

export interface IFormDesc {
  [key: string]: IFormDescItem
}

export type IConfig = {}
