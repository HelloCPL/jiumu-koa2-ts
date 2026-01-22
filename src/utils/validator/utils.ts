/**
 * 校验的辅助方法
 */

import { getTagByParentCode } from '@/router/controller/tags/get'
import { isArray, isString } from 'lodash'
import { ExceptionParameter } from '../http-exception'
import { Message } from '@/enums'
import { TagOptions } from '@/router/controller/tags/interface'
import { FieldRuleOptions, RequiredParams } from './type'

interface RangeOptions {
  value: any // 校验值
  range: any[] | string // 校验范围，自定义数据数组或指定code标签（指父级code）
  message?: string
  default?: any // 指定value无值时赋予的默认值
}

/**
 * 校验指定参数是否在指定范围内容，如果不在默认抛出错误
 * @param data 校验对象或数组，如果 data 参数是数组，如果 noThrow=true 则返回对应数量的指定参数
 * @param noThrow 不满足条件是，是否不抛出错误，如果 noThrow=true 返回指定参数
 */
export const validateRange = async (data: RangeOptions | RangeOptions[], noThrow?: boolean) => {
  const _handleValid = async (info: RangeOptions) => {
    let flag = false
    if (info.value || info.value === 0 || info.value === false) {
      if (isArray(info.range)) {
        // @ts-ignore
        info.range.find((val) => {
          if (info.value === val) {
            flag = true
            return true
          }
        })
      } else if (isString(info.range)) {
        const res = await getTagByParentCode(info.range)
        if (res && res.length) {
          const codes = _getTagsCode(res)
          if (codes.indexOf(info.value) !== -1) flag = true
        }
      }
    }
    if (flag) return info.value
    else if (noThrow) return info.default
    else throw new ExceptionParameter({ message: info.message || Message.parameter })
  }
  if (isArray(data)) {
    const targetData: any[] = []
    for (let i = 0, len = data.length; i < len; i++) {
      const value = await _handleValid(data[i])
      targetData.push(value)
    }
    return targetData
  } else {
    return await _handleValid(data)
  }
}

// 获取标签指定 code 一维数据列表
function _getTagsCode(data: TagOptions[]): string[] {
  const codes: string[] = []
  const _handleGetCode = (arr: TagOptions[]) => {
    arr.forEach((item) => {
      codes.push(item.code)
      if (isArray(item.children) && item.children.length) _handleGetCode(item.children)
    })
  }
  _handleGetCode(data)
  return codes
}

/**
 * 生成校验参数规则
 * @param params 校验参数集合
 * @returns 返回符合校验规范的数组
 */
export const generateRequiredParams = (params: Array<string | RequiredParams>): FieldRuleOptions[] => {
  const data: FieldRuleOptions[] = []
  params.forEach((item) => {
    if (typeof item === 'string' && item) {
      data.push({
        field: item,
        rules: ['isLength', '', [{ min: 1 }], true]
      })
    } else if (typeof item === 'object' && item.field) {
      data.push({
        field: item.field,
        rules: [item.name, item.message || '', item.options, item.required]
      })
    }
  })
  return data
}
