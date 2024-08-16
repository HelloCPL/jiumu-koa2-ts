import { handleField, handleKeyword, handleOrderFields } from './tools'

/**
 * 处理 SELECT 查询列表时 WHERE 条件为 keyword 字段时 sql 表要参与筛选的有效字段
 *   options.valid sql 表要参与筛选有效的字段集合，字段名规则遵循 @handleField 规则
 * options.data 传参对象（需包含 keyword 字段，其中分隔符遵循 @handleKeyword 规则 ）
 * options.connector 多个筛选条件间的连接符，默认 OR
 * options.prefix 查询 sql 语句为真时要添加的前缀
 * options.isOrderKeyword 是否需要处理搜索替换字段和排序条件
 */
export const getSelectWhereKeyword = (
  options: SQLUtilsOptionsOrderKeyword
): SQLUtilsOptionsOrderKeywordResult => {
  const sqls: string[] = []
  const data: any[] = []
  const { connector = 'OR', prefix } = options
  const keywords = handleKeyword(options.data.keyword)
  // 处理 where keyword 的查询条件
  keywords.forEach((keyword) => {
    options.valid.forEach((field) => {
      const result = handleField(field)
      if (result.isValid) {
        const compair = result.isEqual ? '=' : 'LINK'
        const word = result.isEqual ? keyword : `%${keyword}%`
        sqls.push(` ${result.field} ${compair} ? `)
        data.push(word)
      }
    })
  })
  let sql = sqls.join(` ${connector} `)
  if (sql) {
    sql = prefix ? ` ${prefix} (${sql})` : `(${sql})`
  }

  return {
    sql,
    data,
    ...getOrderKeyword(options, keywords)
  }
}

/**
 * where 模糊查询，需要 order keyword 排序时，处理返回的搜索替换字段和排序条件
 */
function getOrderKeyword(options: SQLUtilsOptionsOrderKeyword, keywords: string[]) {
  let orderFields = ''
  const orderSqls: string[] = []
  if (options.isOrderKeyword) {
    const highlight = options.data.highlight === '1'
    options.valid.forEach((field) => {
      const result = handleField(field)
      if (keywords.length && highlight && result.validHighlightCount < 2) {
        let _orderFields = ''
        keywords.forEach((keyword) => {
          _orderFields = handleOrderFields(_orderFields, result.field, keyword)
          const orderSql = ` (select LENGTH(${result.field}) - LENGTH('${keyword}')) DESC `
          orderSqls.push(orderSql)
        })
        if (_orderFields) orderFields += ` ${_orderFields} AS ${result.dataField}, `
      } else if (result.isValid && result.validHighlightCount === 0) {
        orderFields += ` ${result.field}  AS ${result.dataField}, `
      }
    })
  }
  return {
    orderFields,
    orderSql: orderSqls.join(',')
  }
}
