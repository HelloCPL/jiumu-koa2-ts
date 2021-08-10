/**
 * @description: 定义常用的校验方法
 * @author chen
 * @update 2021-01-20 15:50:57
 * @remark 校验方式参考 https://www.npmjs.com/package/validator
 * @list 方法集合说明
 *   ValidatorParameter // 校验一个参数类
 *   ValidatorParameters // 校验多个参数类
*/

import { Rule, LinValidator } from '../lib/lin-validator'
import _ from 'lodash'
import { ExceptionHttp, ExceptionParameter } from '../utils/http-exception'
import { Message } from '../enums'

type RulesOptions = any[]

export interface ValidatorOptions {
  key: string,
  rules: RulesOptions | RulesOptions[]
}

class ValidatorParam extends LinValidator {
  constructor() {
    super()
  }

  protected setRule(rule: ValidatorOptions) {
    if (!_.isArray(rule.rules) || rule.rules.length === 0)
      throw new ExceptionHttp({ message: Message.rules })
    let ruleList = []
    if (_.isArray(rule.rules[0])) {
      rule.rules.forEach((item: any) => {
        ruleList.push(
          new Rule(item[0], item[1])
        )
      })
    } else {
      ruleList.push(
        new Rule(rule.rules[0], rule.rules[1])
      )
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
  value: any, // 校验值
  range: any[], // 校验范围
  message?: string,
  noThrow?: boolean, // 不抛出错误
  default?: any, // 默认值
}

/**
 * 校验参数是否在指定范围内容
*/
export const validateRange = (info: RangeOptions) => {
  let flag = false
  if (info.value || info.value === 0 || info.value === false) {
    // @ts-ignore 
    info.range.find(val => {
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
  }
  if (flag) return info.value
  else if (info.noThrow) return info.default
  else throw new ExceptionParameter({ message: info.message || Message.parameter })
}
