import { Message } from '@/enums'
import validator from 'validator'
import { RequiredParams } from './type'
import { Context } from 'koa'
import { cloneDeep, get, isArray, isNumber } from 'lodash'
import { ExceptionParameter } from '../http-exception'

export class CustomValidator {
  [key: string]: any

  // 接口传递过来的参数
  public __data__: Record<string, any>

  constructor() {
    this.__data__ = {}
  }

  /**
   * 规则校验方法
   * @params ctx 请求上下文
   * @params onlyFormat 是否仅格式化上下文参数
   */
  validate(ctx: Context, onlyFormat?: boolean) {
    const params = this._assembleAllParams(ctx)
    this.__data__ = cloneDeep(params)
    ctx.v = this
    if (onlyFormat) return this
    const memberKeys: string[] = findMembers(this, {
      filter: this._findMembersFilter.bind(this)
    })
    const errorMsgs: string[] = []
    for (const key of memberKeys) {
      const result = this._check(key)
      if (!result.success) errorMsgs.push(result.message)
    }
    if (errorMsgs.length > 0) {
      throw new ExceptionParameter({ message: errorMsgs.join(';') })
    }
    return this
  }

  _assembleAllParams(ctx: Context) {
    return {
      body: ctx.request.body,
      query: ctx.request.query,
      path: ctx._params,
      header: ctx.request.header
    }
  }

  _findMembersFilter(key: any) {
    const isRuleType = this[key] instanceof Rule
    if (isRuleType) return true
    return false
  }

  _check(key: string) {
    const rule = this[key] as Rule
    const ruleField = new RuleField(rule)
    const params = this._findParam(key)
    const result = ruleField.validate(params.value)
    if (!result.pass) {
      return {
        message: getErrorMsg(result.message, key, params.value, rule.name, rule.options),
        success: false
      }
    }
    return {
      message: 'ok',
      success: true
    }
  }

  _findParam(key: string) {
    let value: any
    value = get(this.__data__, ['query', key])
    if (value) {
      return { value, path: ['query', key] }
    }
    value = get(this.__data__, ['body', key])
    if (value) {
      return { value, path: ['body', key] }
    }
    value = get(this.__data__, ['path', key])
    if (value) {
      return { value, path: ['path', key] }
    }
    value = get(this.__data__, ['header', key])
    if (value) {
      return { value, path: ['header', key] }
    }
    return { value: null, path: [] }
  }
}

/**
 * 规则记录结果类
 */
class RuleResult {
  // 规则是否通过
  public pass: boolean
  // 错误信息
  public message: string

  constructor(pass: boolean, message = '') {
    this.pass = pass
    this.message = message
  }
}

/**
 * 生成校验规则的类
 */
export class Rule {
  // validator 校验方法名称
  public name: RequiredParams['name']
  // 校验方法对应的参数
  public options: any[]
  // 错误信息
  public message: string
  // 是否必填
  public required: boolean

  constructor(name: RequiredParams['name'], message: string, options?: any, required?: boolean) {
    this.name = name
    this.message = message
    if (isArray(options)) this.options = options
    else this.options = []
    this.required = required !== false
  }

  /**
   * 规则校验方法
   * @params value 需要校验字段的值
   * 校验为 false 情况
   *   1. this.required 为true时，value===null 或校验结果为 false
   *   2. this.required 为false时，value!==null 且校验结果为 false
   */
  validate(value: any) {
    const notValid = !validateName(this.name, this.options, value)
    const flag1 = this.required && (value === null || notValid)
    const flag2 = !this.required && value !== null && notValid
    if (flag1 || flag2) {
      return new RuleResult(false, this.message)
    }
    return new RuleResult(true)
  }
}

/**
 * 字段规则记录结果类
 * @descrition 与 RuleResult 相比增加一个 legalValue 对应校验方法格式化后的值
 */
class RuleFieldResult extends RuleResult {
  // 格式化后的值
  public legalValue: any

  constructor(pass: boolean, message = '', legalValue: any = null) {
    super(pass, message)
    this.legalValue = legalValue
  }
}

/**
 * 对某个字段的规则进行校验的类
 */
class RuleField {
  public rule: Rule
  constructor(rule: Rule) {
    this.rule = rule
  }

  /**
   * 字段规则校验方法
   */
  validate(value: any) {
    const fieldResult = new RuleFieldResult(false)
    const result = this.rule.validate(value)
    if (!result.pass) {
      fieldResult.message = result.message
      fieldResult.legalValue = null
      return fieldResult
    }
    return new RuleFieldResult(true, '', this._convert(value))
  }

  _convert(value: any) {
    if (this.rule.name === 'isInt') {
      return parseInt(value)
    } else if (this.rule.name === 'isFloat') {
      return parseFloat(value)
    } else if (this.rule.name === 'isBoolean') {
      return value ? true : false
    } else if (this.rule.name === 'isNumeric') {
      return Number(value)
    }
    return value
  }
}

interface MembersOptions {
  prefix?: any
  specifiedType?: any
  filter?: any
}

// 属性过滤
function findMembers(instance: any, options: MembersOptions) {
  function _find(instance: any): any {
    if (instance.__proto__ === null) return []
    const keys = Reflect.ownKeys(instance)
    const filterName = keys.filter((key: any) => {
      if (options.filter && options.filter(key)) return true
      if (options.prefix && key.startsWith(options.prefix)) return true
      if (options.specifiedType && instance[key] instanceof options.specifiedType) return true
      return false
    })
    return [...filterName, ..._find(instance.__proto__)]
  }

  return _find(instance)
}

// 校验方法
function validateName(name: RequiredParams['name'], options: any[], value: any): boolean {
  const fn = validator[name]
  if (!fn) return true
  // @ts-ignore
  if (fn(value + '', ...options)) {
    if (name === 'isNumeric') {
      const obj: any = options[0] || {}
      if (obj?.min && isNumber(obj.min) && Number(value) < obj.min) return false
      if (obj?.max && isNumber(obj.max) && Number(value) > obj.max) return false
    }
    return true
  }
  return false
}

// 格式化错误信息
function getErrorMsg(
  message: string,
  key: string,
  value: any,
  name: RequiredParams['name'],
  options: any[]
): string {
  if (message) return message
  const isValue = value || value === 0 || value === false
  if (!isValue) return key + Message.required
  const v1 = name === 'isNumeric'
  if (v1) {
    const obj: any = options[0] || {}
    if (obj?.min && isNumber(obj.min) && Number(value) < obj.min) return `${key}参数不能小于${obj.min}`
    if (obj?.max && isNumber(obj.max) && Number(value) > obj.max) return `${key}参数不能大于${obj.max}`
    return `${key}参数必须是数字`
  }
  const v2 = name === 'isInt'
  if (v2) {
    const obj: any = options[0] || {}
    if (obj?.min && isNumber(obj.min) && Number(value) < obj.min) return `${key}参数不能小于${obj.min}`
    if (obj?.max && isNumber(obj.max) && Number(value) > obj.max) return `${key}参数不能大于${obj.max}`
    return `${key}参数必须是整型`
  }
  const v3 = name === 'contains' && typeof options[0] === 'string'
  if (v3) return `${key}参数必须包含${options[0]}`
  const v4 = name === 'equals' && typeof options[0] === 'string'
  if (v4) return `${key}参数必须等于${options[0]}`
  const v5 = name === 'isBase64'
  if (v5) return `${key}参数必须是base64格式`
  const v6 = name === 'isIn' && isArray(options[0]) && options[0].length > 0
  if (v6) return `${key}参数必须是${options[0].join('或')}`
  const v7 = name === 'isAlpha'
  if (v7) return `${key}参数必须是字母`
  const v8 = name === 'isLength'
  if (v8) {
    const obj: any = options[0] || {}
    if (obj?.min && isNumber(obj.min) && obj.min !== 1 && value.length < obj.min)
      return `${key}参数长度不能小于${obj.min}`
    if (obj?.max && isNumber(obj.max) && value.length > obj.max) return `${key}参数长度不能大于${obj.max}`
    if (obj?.min && obj.min === 1) return key + Message.required
  }
  return key + Message.parameter
}
