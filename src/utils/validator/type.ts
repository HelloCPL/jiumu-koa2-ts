import validator from 'validator'

// 提取 validator 中的所有函数名作为规则名称的可能值
type ValidatorFunctionName = keyof {
  [K in keyof typeof validator as typeof validator[K] extends Function ? K : never]: typeof validator[K]
}

// 对于每个函数，提取其参数类型（去除第一个 string 参数）
type GetRuleOptions<T extends (...args: any) => any> = T extends (str: string, ...args: infer R) => any
  ? R
  : never

// 基础规则选项映射
type BaseRuleOptionsMap = {
  [K in ValidatorFunctionName]: GetRuleOptions<typeof validator[K]>
}

// 扩展的选项类型
type ExtendedOptions = {
  min?: number
  max?: number
}

// 使用映射类型创建规则名到参数类型的映射
// type RuleOptionsMap = {
//   [K in ValidatorFunctionName]: GetRuleOptions<typeof validator[K]>
// }
type RuleOptionsMap = {
  [K in ValidatorFunctionName]: K extends 'isNumeric'
    ? [...(BaseRuleOptionsMap[K] & ExtendedOptions)]
    : BaseRuleOptionsMap[K]
}

// 参数必填类型
export interface RequiredParams {
  field: string // 字段名称
  name: ValidatorFunctionName // validator 规则校验方法名称
  options?: RuleOptionsMap[RequiredParams['name']] // 对应规则的参数（数组，且去除第一个input输入参
  message?: string // 字段校验规则错误时提示
  required?: boolean // 是否必填，为 false 时仅值为真时才校验值的格式，默认 true
}

/**
 * 规则类型
 */
export type RuleOptions = [
  name: RequiredParams['name'],
  message: string,
  options?: RequiredParams['options'],
  required?: boolean
]

/**
 * 字段规则类型
 */
export interface FieldRuleOptions {
  field: string
  rules: RuleOptions
}
