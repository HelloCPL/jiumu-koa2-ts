import { handleField } from './tools'

/**
 * 处理 UPDATE 更新语句可更新的有效字段（即只更新有传递参数的字段）
 *   options.valid 有效的字段集合，字段名规则遵循 @handleField 规则
 *   options.data 参数对象（即客户端传过来的参数对象）
 */
export const getUpdateFields = (options: SQLUtilsOptionsBase): SQLUtilsOptionsResult => {
  const sqls: string[] = []
  const data: any[] = []
  options.valid.forEach((key) => {
    const result = handleField(key)
    if (result.isValid && options.data.hasOwnProperty(result.dataField)) {
      sqls.push(` ${result.field} = ? `)
      data.push(options.data[result.dataField])
    }
  })
  return {
    sql: sqls.join(','),
    data
  }
}
