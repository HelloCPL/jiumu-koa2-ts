import { handleField } from './tools'

/**
 * 处理 SELECT 查询语句时 WHERE 条件的有效字段（即只对有传递参数的字段做 WHERE 筛选）
 *   options.valid 有效的字段集合，字段名规则遵循 @handleField 规则
 *   options.data 参数对象（即客户端传过来的参数对象）
 *   options?.connector 多个筛选条件间的连接符，默认 AND
 *   options?.prefix 查询 sql 语句为真时要添加的前缀
 */
export const getSelectWhereFields = (options: SQLUtilsOptions): SQLUtilsOptionsResult => {
  const sqls: string[] = []
  const data: any[] = []
  const { connector = 'AND', prefix } = options
  options.valid.forEach((key) => {
    const result = handleField(key)
    const flag1 = result.isValid && options.data.hasOwnProperty(result.dataField)
    const flag2 =
      options.data[result.dataField] ||
      options.data[result.dataField] === 0 ||
      options.data[result.dataField] === false
    if (flag1 && flag2) {
      sqls.push(` ${result.field} = ? `)
      data.push(options.data[result.dataField])
    }
  })
  let sql = sqls.join(` ${connector} `)
  if (sql) {
    sql = prefix ? ` ${prefix} (${sql})` : `(${sql})`
  }
  return {
    sql,
    data
  }
}
