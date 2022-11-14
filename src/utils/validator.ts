/**
 * @description: 定义常用的校验方法
 * @author chen
 * @update 2021-01-20 15:50:57
 * @remark 校验方式参考 https://www.npmjs.com/package/validator
 * @list 方法集合说明
 *   ValidatorParameter // 校验一个参数类
 *   ValidatorParameters // 校验多个参数类
 *   validateRange // 校验参数是否在指定范围内容
 */

import { Rule, LinValidator } from '../lib/lin-validator'
import _ from 'lodash'
import { ExceptionHttp, ExceptionParameter } from '../utils/http-exception'
import { Message } from '../enums'
import { getTagByParentCode } from '../router/controller/tags/get'
import { TagOptions } from '../router/controller/tags/interface'

type RulesOptions = any[]

export interface ValidatorOptions {
  key: string
  rules: RulesOptions | RulesOptions[]
}

class ValidatorParam extends LinValidator {
  constructor() {
    super()
  }

  protected setRule(rule: ValidatorOptions) {
    if (!_.isArray(rule.rules) || rule.rules.length === 0) throw new ExceptionHttp({ message: Message.rules })
    let ruleList = []
    if (_.isArray(rule.rules[0])) {
      rule.rules.forEach((item: any) => {
        ruleList.push(new Rule(item[0], item[1], item[2]))
      })
    } else {
      ruleList.push(new Rule(rule.rules[0], rule.rules[1], rule.rules[2]))
    }
    // @ts-ignore
    this[rule.key] = ruleList
  }
}

/**
 * @author chen
 * @params {key, rules: [type, msg, rule]}
 * @params 或 { key, rules: [[type, msg, rule], ...]}
 * @description: 校验一个参数
 * @update 2021-01-20 15:52:12
 */
export class ValidatorParameter extends ValidatorParam {
  constructor(rules: ValidatorOptions) {
    super()
    if (_.isPlainObject(rules)) {
      this.setRule(rules)
    } else {
      throw new ExceptionHttp({ message: Message.rules })
    }
  }
}

/**
 * @author chen
 * @params [{key, rules: [type, msg, rule]}, ...]
 * @params 或 [{ key, rules: [[type, msg, rule], ...]}, ...]
 * @description: 校验多个参数
 * @update 2021-01-20 15:53:45
 */
export class ValidatorParameters extends ValidatorParam {
  constructor(rules: ValidatorOptions[]) {
    super()
    if (_.isArray(rules)) {
      for (let i = 0, len = rules.length; i < len; i++) {
        let rule = rules[i]
        this.setRule(rule)
      }
    } else {
      throw new ExceptionHttp({ message: Message.rules })
    }
  }
}

interface RangeOptions {
  value: any // 校验值
  range: any[] | string // 校验范围，自定义数据数组或指定标签
  message?: string
  default?: any // 默认值
}

/**
 * 校验指定参数是否在指定范围内容，如果不在默认抛出错误
 * 如果 noThrow=true 返回指定参数
 * 如果 data 参数是数组，如果 noThrow=true 则返回对应数量的指定参数
 */
export const validateRange = async (data: RangeOptions | RangeOptions[], noThrow?: boolean) => {
  const _handleValid = async (info: RangeOptions) => {
    let flag = false
    if (info.value || info.value === 0 || info.value === false) {
      if (_.isArray(info.range)) {
        // @ts-ignore
        info.range.find((val) => {
          if (_.isBoolean(info.value)) {
            if (info.value === val) {
              flag = true
              return true
            }
          } else {
            if (info.value == val) {
              flag = true
              return true
            }
          }
        })
      } else if (_.isString(info.range)) {
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
  if (_.isArray(data)) {
    let targetData: any[] = []
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
  let codes: string[] = []
  const _handleGetCode = (arr: TagOptions[]) => {
    arr.forEach((item) => {
      codes.push(item.code)
      if (_.isArray(item.children) && item.children.length) _handleGetCode(item.children)
    })
  }
  _handleGetCode(data)
  return codes
}
