// sql 处理方法基础参数
interface SQLOptionsBase {
  valid: string[]
  data: ObjectAny
}

// sql 处理方法参数
interface SQLOptions extends SQLOptionsBase {
  connector?: string // 多个字段时所需的连接符
  prefix?: string // 前缀
}

//
interface SQLOptionsResult extends ObjectAny {
  sql: string
  data: any[]
}

// 处理某个字段的方法参数
interface SQLKeyResult {
  field: string
  dataField: string // 返回的data字段
  isEqual: boolean // 是否全等比较
  isValid: boolean // 是否参与比较
}
