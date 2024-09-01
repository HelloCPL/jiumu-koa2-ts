/**
 * @description: 中间公共方法
 * @author chen
 * @update 2021-08-13 16:20:40
 */

import { query } from '@/db'
import { ExceptionParameter } from '@/utils/http-exception'
import { Message } from '@/enums'

interface ExistDataOptions {
  key: string
  value: any
  connector?: string // 连接符 默认 =
}

interface ExistBaseOptions {
  table: string // 指定表名称
  throwType?: boolean // 抛出条件，当 noThrow 为 false 有效
  message?: string // 指定提示消息
  noThrow?: boolean // 不抛出错误，如果不抛出则返回是否存在
}

interface ExistOptions extends ExistBaseOptions {
  where: ExistDataOptions[] // 指定字段
  connector?: string // 多条件时指定连接符
}

/**
 * 判断指定数据表的指定字段是否存在
 * 默认自动抛出错误，noThrow 为 true 时返回是否存在
 * @param options.table 指定数据表
 * @param options.where[] 查询条件集合
 *        options.where[0].key 查询条件
 *        options.where[0].value 查询条件
 *        options.where[0].connector 多个查询条件的连接符
 * @param options.noThrow? 是否不抛出错误，默认 false （即默认抛出错误）
 * @param options.throwType? 抛出错误的条件（即指定结果true抛出错误还是false才抛出错误），当 noThrow 为 false 时有效
 * @param options.message? 抛出错误时指定提示消息，当 noThrow 为 false 时有效
 */
export const isExist = async (options: ExistOptions) => {
  options.connector = options.connector || 'AND'
  let whereSql: string = ''
  const whereData: any[] = []
  options.where.forEach((item) => {
    const connector = item.connector || '='
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

interface ExistChildrenDataOptions extends ExistDataOptions {
  childKey?: string
  parentKey?: string
}

interface ExistChildrenOptions extends ExistBaseOptions {
  where: ExistChildrenDataOptions
}

/**
 * 判断指定树级结构的数据表的指定字段是否有子级
 * 默认自动抛出错误，noThrow 为 true 时返回是否存在
 * @param options.table 指定数据表
 * @param options.where 查询条件
 *        options.where.key 查询条件
 *        options.where.value 查询条件
 *        options.where.connector 多个查询条件的连接符
 *        options.where.childKey 查询条件
 *        options.where.parentKey 查询条件
 * @param options.noThrow? 是否不抛出错误，默认 false （即默认抛出错误）
 * @param options.throwType? 抛出错误的条件（即指定结果true抛出错误还是false才抛出错误），当 noThrow 为 false 时有效
 * @param options.message? 抛出错误时指定提示消息，当 noThrow 为 false 时有效
 */
export const isExistHasChildren = async (options: ExistChildrenOptions) => {
  const childKey = options.where.childKey || 'code'
  const parentKey = options.where.parentKey || 'parent_code'
  const sql = `
    SELECT 
      t1.id 
    FROM ${options.table} t1 
    WHERE 
      t1.${parentKey} IN 
        (SELECT t2.${childKey} FROM ${options.table} t2 WHERE t2.${options.where.key} = ?)`
  const res: any = await query(sql, options.where.value)
  const _isExist = res && res.length
  if (options.noThrow) {
    if (_isExist || !options.where.value) return true
    return false
  } else {
    if (options.throwType && _isExist) {
      throw new ExceptionParameter({ message: options.message || Message.parameter })
    } else if (!options.throwType && !_isExist) {
      throw new ExceptionParameter({ message: options.message || Message.parameter })
    }
  }
}

/**
 * 判断指定用户是否为管理员角色
 * @param userId 用户 id
 */
export const isSuper = async (userId: string): Promise<boolean> => {
  let flag = false
  const sql =
    'SELECT t1.id FROM users_roles t1 LEFT JOIN roles t2 ON t1.role_id = t2.id WHERE t1.user_id  = ? AND t2.code = ?'
  const data = [userId, 'super']
  const res: any = await query(sql, data)
  if (res && res.length) {
    flag = true
  }
  return flag
}
