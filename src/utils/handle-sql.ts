/**
 * @description: 处理 mysql 查询语句参数与数据
 * @author chen
 * @update 2021-08-11 15:51:06
 * * @list 方法集合说明
 *   getUpdateSetData // 处理 UPDATE 更新语句可更新值
 *   getSelectWhereData // 处理 SELECT 查询列表时 WHERE 条件语句有效值
 *   getSelectWhereAsKeywordData // 处理 SELECT 查询列表时 WHERE 条件为 keyword 语句有效值
 */

import _ from 'lodash'

interface paramsOptions {
  valid: string[]
  data: ObjectAny
  connector?: string
  prefix?: string
}

/**
 * 处理 UPDATE 更新语句可更新值
 * options.valid 有效的参数名集合
 *   !xxx 前缀声明不参数sql字段查询 如 !username
 *   xxx. 前缀指定表名 users.username
 *   key:newKey 指定新的key名 如 username:createUser
 * options.data 传参对象
 */
export const getUpdateSetData = (options: paramsOptions): SQLParamsOptions => {
  let sql: string = ''
  const data: any[] = []
  options.valid.forEach((key) => {
    const keys: KeyOptions = _findKeys(key)
    if (options.data.hasOwnProperty(keys.dataKey) && keys.isSqlKey) {
      sql = sql ? sql + ` , ${keys.sqlKey} = ? ` : ` ${keys.sqlKey} = ? `
      const value = options.data[keys.dataKey]
      data.push(value)
    }
  })
  return { sql, data }
}

/**
 * 处理 SELECT 查询列表时 WHERE 条件语句有效值
 * options.valid
 *   !xxx 前缀声明不参数sql字段查询 如 !username
 *   xxx. 前缀指定表名 users.username
 *   key:newKey 指定新的key名 如 username:createUser
 * options.data 传参对象
 * options.connector 参数间的连接符 默认 AND
 * options.prefix sql为真时添加的前缀连接符
 */
export const getSelectWhereData = (options: paramsOptions): SQLParamsOptions => {
  let sql: string = ''
  const data: any[] = []
  const { connector = 'AND', prefix } = options
  options.valid.forEach((key) => {
    const keys: KeyOptions = _findKeys(key)
    // 传参有参数且值为真或0或false
    const flag =
      options.data.hasOwnProperty(keys.dataKey) &&
      (options.data[keys.dataKey] ||
        options.data[keys.dataKey] === 0 ||
        options.data[keys.dataKey] === false) &&
      keys.isSqlKey
    if (flag) {
      sql = sql ? sql + ` ${connector} ${keys.sqlKey} = ? ` : ` ${keys.sqlKey} = ? `
      data.push(options.data[keys.dataKey])
    }
  })
  if (sql) sql = prefix ? ` ${prefix} (${sql})` : `(${sql})`
  return { sql, data }
}

/**
 * 处理 SELECT 查询列表时 WHERE 条件为 keyword 语句有效值
 * options.valid
 *   !xxx 前缀声明不参数sql字段查询 如 !username
 *   xxx. 前缀指定表名 users.username
 *   (key) 全选匹配 如 (username)
 *   key:newKey 指定新的key名 如 username:createUser
 * options.data 传参对象
 * options.connector 参数间的连接符 默认 OR
 * options.prefix sql为真时添加的前缀
 */
export const getSelectWhereAsKeywordData = (options: paramsOptions): SQLParamsOptions => {
  let sql: string = ''
  const data: any[] = []
  const { connector = 'OR', prefix } = options
  let keywords: any[] =
    typeof options.data.keyword === 'string'
      ? options.data.keyword.replace(/[\s|;|；|，]/g, ',').split(',')
      : []
  // 去重
  keywords = handleKeywords(keywords)
  keywords.forEach((keyword) => {
    options.valid.forEach((key) => {
      const keys: KeyOptions = _findKeys(key)
      if (keys.isSqlKey) {
        let compair = 'LIKE'
        let word = `%${keyword}%`
        if (keys.isEqual) {
          compair = '='
          word = keyword
        }
        sql = sql ? sql + ` ${connector} ${keys.sqlKey} ${compair} ? ` : ` ${keys.sqlKey} ${compair} ? `
        data.push(word)
      }
    })
  })
  if (sql) sql = prefix ? ` ${prefix} (${sql})` : `(${sql})`
  return { sql, data }
}

interface OrderParamsOptions {
  valid: string[]
  data: ObjectAny
  prefix?: string
  suffix?: string
  color?: string
}

interface OrderReturnOptions {
  orderValid: string
  orderSql: string
}

/**
 * @author chen
 * @params options.valid 需要模糊查询的字段 如 username t1.username
 *
 * @description 模糊搜索时返回搜索替换字段和排序条件
 * @update 2021-12-04 19:53:51
 */
/**
 * 模糊搜索时返回搜索替换字段和排序条件
 * options.valid
 *   !xxx 前缀声明不参数sql字段查询 如 !username
 *   xxx. 前缀指定表名 users.username
 *   (key) 全选匹配 如 (username)
 *   key:newKey 指定新的key名 如 username:createUser
 * options.data 传参对象
 * options.prefix orderSql为真时添加的前缀
 * options.suffix orderSql为真时添加的后缀 默认 ','
 * options.color keyword为真时关键字的颜色 默认 '#f56c6c'
 */
export const getOrderByKeyword = (options: OrderParamsOptions): OrderReturnOptions => {
  let orderValid = ''
  let orderSql = ''
  const highlight = options.data.highlight === '1'
  const { prefix, suffix = ',', color = '#f56c6c' } = options
  let keywords: any[] =
    typeof options.data.keyword === 'string'
      ? options.data.keyword
          .replace(/[\s|;|；|，]/g, ',')
          .split(',')
          .filter((val) => val)
      : []
  // 去重
  keywords = handleKeywords(keywords)

  options.valid.forEach((key) => {
    const { sqlKey, dataKey, isSqlKey } = _findKeys(key)
    if (keywords.length) {
      if (highlight) {
        let _orderValid = ''
        keywords.forEach((keyword) => {
          let valid = _orderValid || sqlKey
          valid = valid.trimEnd()
          if (valid.endsWith(',')) valid = valid.substring(0, valid.length - 1)
          _orderValid = `REPLACE(${valid}, '${keyword}', "<span data-search-key='search' style='color: ${color}'>${keyword}</span>")`
          const sql = ` (select LENGTH(${sqlKey}) - LENGTH('${keyword}')) DESC `
          if (orderSql) orderSql += ` , ${sql} `
          else orderSql += sql
        })
        if (_orderValid) orderValid += ` ${_orderValid} AS ${dataKey}, `
      } else if (isSqlKey) {
        orderValid += ` ${sqlKey}  AS ${dataKey}, `
      }
    } else if (isSqlKey) {
      orderValid += ` ${sqlKey} AS ${dataKey}, `
    }
  })
  orderSql && prefix ? (orderSql = ` ${prefix} ${orderSql} `) : ''
  orderSql && suffix ? (orderSql = ` ${orderSql} ${suffix} `) : ''

  return {
    orderValid,
    orderSql
  }
}

interface KeyOptions {
  sqlKey: string
  dataKey: string
  isEqual?: boolean // 是否全等比较，模糊查询时可用
  isSqlKey?: boolean // 是否参与sql字段查询
}
/**
 * 获取 SQL 语句字段名，即下划线命名
 * 和 data 参数字段名，即小驼峰命名
 * str
 *   !xxx 前缀声明不参数sql字段查询 如 !username
 *   xxx. 前缀指定表名 users.username
 *   (key) 全选匹配 如 (username)
 *   key:newKey 指定新的key名 如 username:createUser
 */
function _findKeys(str: string): KeyOptions {
  // 判断是否有 !
  let isSqlKey = true
  if (str.startsWith('!')) {
    isSqlKey = false
    str = str.substring(1)
  }
  // 判断是否有逗号
  let t = '' // 表名前缀
  const i2 = str.indexOf('.')
  if (i2 !== -1) {
    t = str.substring(0, i2)
    str = str.substring(i2 + 1)
  }
  let dataKey = _.camelCase(str)
  let sqlKey = str
  let isEqual = false
  // 判断是否有分号
  const i1 = str.indexOf(':')
  if (i1 !== -1) {
    dataKey = sqlKey.substring(i1 + 1)
    sqlKey = sqlKey.substring(0, i1)
  }
  // 判断sqlKey是否存在括号中
  if (/^\(.*\)$/.test(sqlKey)) {
    sqlKey = sqlKey.substring(1, sqlKey.length - 1)
    isEqual = true
  }
  return {
    dataKey,
    sqlKey: formatKey((t ? t + '.' : '') + _.snakeCase(sqlKey)),
    isEqual,
    isSqlKey
  }
}

// 关键字去重
function handleKeywords(arr: any[]): any[] {
  const _arr: any[] = []
  if (!arr.length) return _arr
  arr.forEach((val) => {
    const flag = val || val === 0 || val === false
    if (flag && _arr.indexOf(val) === -1) _arr.push(val)
  })
  return _arr
}

// sql key 去除数字前的 _
const formatKey = (str: string): string => {
  const i: number = str.search(/_\d+/)
  if (i === 0) str = str.slice(1, str.length)
  else if (i !== -1) str = str.slice(0, i) + str.slice(i + 1, str.length)
  const i2 = str.search(/_\d+/)
  if (i2 !== -1) return formatKey(str)
  return str
}
