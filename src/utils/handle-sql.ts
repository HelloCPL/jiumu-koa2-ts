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
  valid: string[],
  data: ObjectAny
}

/**
 * 处理 UPDATE 更新语句可更新值
 * options.valid 有效的参数名集合 可带表名、指定数据key，如 pas t1.pas pas:password
 * options.data 传参对象
*/
export const getUpdateSetData = (options: paramsOptions): SQLParamsOptions => {
  let sql: string = ''
  let data: any[] = []
  options.valid.forEach((key) => {
    const keys: KeyOptions = _findKeys(key)
    if (options.data.hasOwnProperty(keys.dataKey)) {
      if (data.length === 0) sql += ` \`${keys.sqlKey}\` = ? `
      else sql += ` , \`${keys.sqlKey}\` = ? `
      data.push(options.data[keys.dataKey])
    }
  })
  return { sql, data }
}

/**
 * 处理 SELECT 查询列表时 WHERE 条件语句有效值
 * options.valid 有效的参数名集合 可带表名、指定数据key，如 pas t1.pas pas:password
 * options.data 传参对象
 * connector 参数间的连接符
 * prefix sql为真时是否添加前缀
*/
export const getSelectWhereData = (options: paramsOptions, connector: string = 'AND', prefix?: string): SQLParamsOptions => {
  let sql: string = ''
  let data: any[] = []
  options.valid.forEach((key) => {
    const keys: KeyOptions = _findKeys(key)
    // 传参有参数且值为真或0或false
    const flag = options.data.hasOwnProperty(keys.dataKey) && (options.data[keys.dataKey] || options.data[keys.dataKey] === 0 || options.data[keys.dataKey] === false)
    if (flag) {
      if (data.length === 0) sql += ` \`${keys.sqlKey}\` = ? `
      else sql += ` ${connector} \`${keys.dataKey}\` = ? `
      data.push(options.data[keys.dataKey])
    }
  })
  if (sql) sql = prefix ? ` ${prefix} (${sql})` : `(${sql})`
  return { sql, data }
}

/**
 * 处理 SELECT 查询列表时 WHERE 条件为 keyword 语句有效值
 * options.valid 需要模糊查询的字段 可带表名、指定数据key，如 pas t1.pas pas:password
 * options.data 传参对象
 * connector 参数间的连接符
 * prefix sql为真时是否添加前缀
*/
export const getSelectWhereAsKeywordData = (options: paramsOptions, connector: string = 'OR', prefix?: string): SQLParamsOptions => {
  let sql: string = ''
  let data: any[] = []
  options.valid.forEach((key) => {
    const keys: KeyOptions = _findKeys(key)
    // keyword为真或0或false
    const flag = options.data.keyword || options.data.keyword === 0 || options.data.keyword === false
    if (flag) {
      if (data.length === 0) sql += ` \`${keys.sqlKey}\` LIKE ? `
      else sql += ` ${connector} \`${keys.dataKey}\` LIKE ? `
      data.push(`%${options.data.keyword}%`)
    }
  })
  if (sql) sql = prefix ? ` ${prefix} (${sql})` : `(${sql})`
  return { sql, data }
}

interface KeyOptions {
  sqlKey: string,
  dataKey: string
}
/**
 * 获取 SQL 语句字段名，即下划线命名
 * 和 data 参数字段名，即小驼峰命名
*/
function _findKeys(str: string, ): KeyOptions {
  let dataKey = str
  let sqlKey = str
  let i1 = str.indexOf(':')
  if (i1 !== -1) {
    dataKey = sqlKey.substring(i1 + 1)
    sqlKey = sqlKey.substring(0, i1)
  }
  let i2 = str.indexOf('.')
  if (i2 !== -1) {
    dataKey = sqlKey.substring(i2 + 1)
    sqlKey = sqlKey.substring(0, i2) + '.' + _.snakeCase(sqlKey.substring(i2 + 1))
  } else {
    sqlKey = _.snakeCase(sqlKey)
  }
  return {
    dataKey: _.camelCase(dataKey),
    sqlKey
  }
}