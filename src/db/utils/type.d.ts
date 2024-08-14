// sql 处理方法基础参数
interface SQLUtilsOptionsBase {
  valid: string[]
  data: ObjectAny
}

// sql 处理方法参数
interface SQLUtilsOptions extends SQLUtilsOptionsBase {
  connector?: string // 多个字段时所需的连接符
  prefix?: string // 前缀
}

// sql 语句处理返回结果
interface SQLUtilsOptionsResult extends ObjectAny {
  sql: string
  data: any[]
}

// sql 处理方法参数
interface SQLUtilsOptionsOrderKeyword extends SQLUtilsOptions {
  isOrderKeyword?: boolean // 是否处理 order keyword 的排序
}

// keyword 搜索条件需要高亮显示结果时 语句返回结果
interface SQLUtilsOptionsOrderKeywordResult extends SQLUtilsOptionsResult {
  orderFields: string
  orderSql: string
}

// 处理某个字段的方法参数
interface SQLUtilsKeyResult {
  field: string
  dataField: string // 返回的data字段
  isEqual: boolean // 是否全等比较
  isValid: boolean // 是否参与比较
  isValidHighlight: boolean // 高亮查询时是否给出 SELECT 的字段
}
