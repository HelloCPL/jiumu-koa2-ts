/**
 * @description: 处理 mysql 查询语句参数与数据
 * @author chen
 * @update 2021-08-11 15:51:06
*/

import _ from 'lodash'

interface paramsOptions {
  valid: string[],
  data: ObjectAny
}

interface ReturnOptions {
  sql: string,
  data: any[]
}

/**
 * 处理 UPDATE 更新语句可更新值
 * paramsOptions.valid 有效的参数名集合 可带表名、指定数据key，如 pas t1.pas pas:password
 * paramsOptions.data 传参对象
*/
export const getUpdateSetData = (options: paramsOptions): ReturnOptions => {
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


interface KeyOptions {
  sqlKey: string,
  dataKey: string
}
/**
 * 获取 SQL 语句字段名，即下划线命名
 * 和 data 参数字段名，即小驼峰命名
*/
function _findKeys(str: string,): KeyOptions {
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