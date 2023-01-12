import type { IFormDescItem, IType } from '../types'
import { PLACEHOLDER_TYPE, TYPE_MAP_COMPONENT } from '../constant'
export function useFormat() {
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

  return {
    handleRule,
    handlePlaceHolder
  }
}
