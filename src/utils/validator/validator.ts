/**
 * 校验方法
 */

import { Message } from '@/enums'
import { Rule, LinValidator } from '@/lib/lin-validator'
import { isArray, isPlainObject } from 'lodash'
import { ExceptionHttp } from '../http-exception'

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
    if (!isArray(rule.rules) || rule.rules.length === 0) throw new ExceptionHttp({ message: Message.rules })
    const ruleList = []
    if (isArray(rule.rules[0])) {
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
    if (isPlainObject(rules)) {
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
    if (isArray(rules)) {
      for (let i = 0, len = rules.length; i < len; i++) {
        const rule = rules[i]
        this.setRule(rule)
      }
    } else {
      throw new ExceptionHttp({ message: Message.rules })
    }
  }
}
