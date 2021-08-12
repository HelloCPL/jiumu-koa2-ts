/**
 * @description 标签模块中间件
 * @author chen
 * @update 2021-08-07 15:12:57
*/

import { Context, Next } from 'koa'
import { query } from '../../../db'
import { ExceptionParameter } from '../../../utils/http-exception'
import { Message } from '../../../enums'

/**
 * 新增时 判断标签是否已存在
*/
export const doTagAddExist = async (ctx: Context, next: Next) => {
  const flag = await isExistTag(ctx.params.code, 'code')
  if (flag)
    throw new ExceptionParameter({ message: Message.existTag })
  await next()
}

/**
 * 修改时 判断标签是否不存在，若修改 code 再判断 code 是否存在
*/
export async function doTagUpdateNoExist(ctx: Context, next: Next) {
  const flag = await isExistTag(ctx.params.id)
  if (!flag)
    throw new ExceptionParameter({ message: Message.unexistTag })
  if (ctx.params.code) {
    const sql = `SELECT id FROM tags WHERE code = ? AND id != ?`
    const data = [ctx.params.code, ctx.params.id]
    const res: any = await query(sql, data)
    if (res && res.length)
      throw new ExceptionParameter({ message: Message.existTag })
  }
  await next()
}

/**
 * 删除时 先判断标签是否存在，再判断是否有子级
*/
export async function doTagDeleteHasChild(ctx: Context, next: Next) {
  const isExist = await isExistTag(ctx.params.id)
  if (!isExist)
    throw new ExceptionParameter({ message: Message.unexistTag })
  const hasChildren = await isExistChildren(ctx.params.id)
  if (hasChildren)
    throw new ExceptionParameter({ message: Message.hasChildren })
  await next()
}

// 根据 id 或 code 判断标签是否存在
export async function isExistTag(value: any, key: string = 'id'): Promise<boolean> {
  let sql = `SELECT id FROM tags WHERE ${key} = ?`
  const res: any = await query(sql, value)
  if (res && res.length) return true
  return false
}

// 根据 id 或 code 判断是否有子级
export async function isExistChildren(value: any, key: string = 'id'): Promise<boolean> {
  if (value == '0' && key === 'code') return true
  const sql = `SELECT t1.id FROM tags t1 WHERE t1.parent_code IN (SELECT t2.code FROM tags t2 WHERE t2.${key} = ?)`
  const res: any = await query(sql, value)
  if (res && res.length) return true
  return false
}