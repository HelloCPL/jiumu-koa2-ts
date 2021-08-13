/**
 * @description: 中间公共方法
 * @author chen
 * @update 2021-08-13 16:20:40
*/

import { query } from "../../../db"
import { ExceptionParameter } from "../../../utils/http-exception"
import { Message } from "../../../enums"

interface DataOptions {
  key: string,
  value: any,
  connector?: string, // 连接符 默认 =
}

interface ExistOptions {
  table: string, // 指定表名称
  where: DataOptions[], // 指定字段
  throwType: boolean, // 抛出条件，但 noThrow 为 false 有效
  message?: string, // 指定提示消息
  noThrow?: boolean, // 不抛出错误，如果不抛出则返回是否存在
  connector?: string, // 多条件时指定连接符
}

/**
 * 判断指定数据库指定字段是否存在
 * 默认自动抛出错误，noThrow 为 true 时返回是否存在
*/
export const isExist = async (options: ExistOptions) => {
  options.connector = options.connector || 'AND'
  let whereSql: string = ''
  let whereData: any[] = []
  options.where.forEach((item) => {
    let connector = item.connector || '='
    if (whereData.length) whereSql += ` ${options.connector} ${item.key} ${connector} ? `
    else whereSql += ` ${item.key} ${connector} ? `
    whereData.push(item.value)
  })
  const sql = `SELECT id FROM ${options.table} WHERE ${whereSql}`
  const res: any = await query(sql, whereData)
  const _isExist = res && res.length
  if (options.noThrow) {
    if (_isExist) return true
    return false
  } else {
    if (options.throwType && _isExist) {
      throw new ExceptionParameter({ message: options.message || Message.parameter })
    } else if (!options.throwType && !_isExist) {
      throw new ExceptionParameter({ message: options.message || Message.parameter })
    }
  }
}

interface ExistChildrenOptions {
  table: string,
  throwType: boolean, // 抛出条件，但 noThrow 为 false 有效
  key: string, //
  parentKey: string,
  noThrow?: boolean, // 不抛出错误，如果不抛出则返回是否存在
}
