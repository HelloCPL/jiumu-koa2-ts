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
 * options.valid 有效的参数名集合 可带表名、指定数据key 如 pas t1.pas pas:password
 * options.data 传参对象
 */
export const getUpdateSetData = (options: paramsOptions): SQLParamsOptions => {
  let sql: string = ''
  let data: any[] = []
  options.valid.forEach((key) => {
    const keys: KeyOptions = _findKeys(key)
    if (options.data.hasOwnProperty(keys.dataKey)) {
      if (data.length === 0) sql += ` ${keys.sqlKey} = ? `
      else sql += ` , ${keys.sqlKey} = ? `
      const value = options.data[keys.dataKey]
      data.push(value)
    }
  })
  return { sql, data }
}

/**
 * 处理 SELECT 查询列表时 WHERE 条件语句有效值
 * options.valid 有效的参数名集合 可带表名、指定数据key，如 pas t1.pas pas:password
 * options.data 传参对象
 * options.connector 参数间的连接符 默认 AND
 * options.prefix sql为真时添加的前缀
 */
export const getSelectWhereData = (options: paramsOptions): SQLParamsOptions => {
  let sql: string = ''
  let data: any[] = []
  const { connector = 'AND', prefix } = options
  options.valid.forEach((key) => {
    const keys: KeyOptions = _findKeys(key)
    // 传参有参数且值为真或0或false
    const flag =
      options.data.hasOwnProperty(keys.dataKey) &&
      (options.data[keys.dataKey] || options.data[keys.dataKey] === 0 || options.data[keys.dataKey] === false)
    if (flag) {
      if (data.length === 0) sql += ` ${keys.sqlKey} = ? `
      else sql += ` ${connector} ${keys.sqlKey} = ? `
      data.push(options.data[keys.dataKey])
    }
  })
  if (sql) sql = prefix ? ` ${prefix} (${sql})` : `(${sql})`
  return { sql, data }
}

/**
 * 处理 SELECT 查询列表时 WHERE 条件为 keyword 语句有效值
 * options.valid 需要模糊查询的字段 可带表名、指定数据key，其中key以()括住的可以进行全等比较，如 username t1.username username:createUserName (username)
 * options.data 传参对象
 * options.connector 参数间的连接符 默认 OR
 * options.prefix sql为真时添加的前缀
 */
export const getSelectWhereAsKeywordData = (options: paramsOptions): SQLParamsOptions => {
  let sql: string = ''
  let data: any[] = []
  const { connector = 'OR', prefix } = options
  let keyword: any = options.data.keyword
  if (typeof keyword === 'string') keyword = keyword.replace(/\s/g, '')
  // keyword为真或0或false
  const flag = keyword || keyword === 0 || keyword === false
  if (flag) {
    options.valid.forEach((key) => {
      const keys: KeyOptions = _findKeys(key)
      let compair = 'LIKE'
      let word = `%${keyword}%`
      if (keys.isEqual) {
        compair = '='
        word = keyword
      }
      if (data.length === 0) sql += ` ${keys.sqlKey} ${compair} ? `
      else sql += ` ${connector} ${keys.sqlKey} ${compair} ? `
      data.push(word)
    })
  }
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
 * options.valid 需要模糊查询的字段、指定字段名称 如 username t1.username t1.username:createUserName
 * options.data 传参对象
 * options.prefix orderSql为真时添加的前缀
 * options.suffix orderSql为真时添加的后缀 默认 ','
 * options.color keyword为真时关键字的颜色 默认 '#f56c6c'
 */
export const getOrderByKeyword = (options: OrderParamsOptions): OrderReturnOptions => {
  let orderValid = ''
  let orderSql = ''
  const { prefix, suffix = ',', color = '#f56c6c' } = options
  let keyword: any = options.data.keyword
  if (typeof keyword === 'string') keyword = keyword.replace(/\s/g, '')
  const flag = keyword || keyword === 0
  const highlight = options.data.highlight === '1'
  options.valid.forEach((key) => {
    const { sqlKey, dataKey } = _findKeys(key)
    if (flag) {
      let sql: string
      if (!highlight) {
        // 不高亮
        orderValid += ` ${sqlKey}  AS ${dataKey}, `
        sql = ''
      } else {
        orderValid += ` REPLACE(${sqlKey}, '${keyword}', "<span data-search-key='search' style='color: ${color}'>${keyword}</span>") AS ${dataKey},  `
        sql = ` (select LENGTH(${sqlKey}) - LENGTH('${keyword}')) DESC `
      }
      if (orderSql) orderSql += ` , ${sql} `
      else orderSql += sql
    } else {
      orderValid += ` ${sqlKey} AS ${dataKey}, `
    }
  })
  orderSql && prefix ? (orderSql = ` ${prefix} ${orderSql} `) : ''
  orderSql && suffix ? (orderSql = ` ${orderSql} ${suffix} `) : ''

  return {
    orderValid,
    orderSql,
  }
}

interface KeyOptions {
  sqlKey: string
  dataKey: string
  isEqual?: boolean // 是否全等比较，模糊查询时可用
}
/**
 * 获取 SQL 语句字段名，即下划线命名
 * 和 data 参数字段名，即小驼峰命名
 */
function _findKeys(str: string): KeyOptions {
  // 判断是否有逗号
  let t = '' // 表名前缀
  let i2 = str.indexOf('.')
  if (i2 !== -1) {
    t = str.substring(0, i2)
    str = str.substring(i2 + 1)
  }
  let dataKey = _.camelCase(str)
  let sqlKey = str
  let isEqual = false
  // 判断是否有分号
  let i1 = str.indexOf(':')
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
    sqlKey: (t ? t + '.' : '') + _.snakeCase(sqlKey),
    isEqual,
  }
}
