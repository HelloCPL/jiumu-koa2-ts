/**
 * 校验方法
 */

import { Message } from '@/enums'
// import { Rule, LinValidator } from '@/lib/lin-validator'
import { Rule, CustomValidator } from './custom-validator'
import { isArray } from 'lodash'
import { ExceptionHttp } from '../http-exception'
import { FieldRuleOptions } from './type'

/**
 * 参数校验
 * @params fieldRule 参数校验规则
 * @demo
 *   [{field: 'username', rules: ['isLength', '用户名不能为空', {min: 5}]}, ...]
 * @update 2021-01-20 15:53:45
 */
export class ValidatorParameters extends CustomValidator {
  [key: string]: any

  constructor(fieldRules: FieldRuleOptions[]) {
    super()
    if (isArray(fieldRules)) {
      for (let i = 0, len = fieldRules.length; i < len; i++) {
        const fieldRule = fieldRules[i]
        this.setFieldRule(fieldRule)
      }
    } else {
      throw new ExceptionHttp({ message: Message.rules })
    }
  }

  protected setFieldRule(fieldRule: FieldRuleOptions) {
    if (!isArray(fieldRule.rules) || fieldRule.rules.length < 2)
      throw new ExceptionHttp({ message: Message.rules })
    this[fieldRule.field] = new Rule(...fieldRule.rules)
  }
}
