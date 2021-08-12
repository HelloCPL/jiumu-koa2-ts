/**
 * @description: 角色模块中间件
 * @author chen
 * @update 2021-08-12 14:20:21
*/

import { Context, Next } from 'koa'
import { query } from '../../../db'
import { ExceptionParameter } from '../../../utils/http-exception'
import { Message } from '../../../enums'


/**
 * 新增时 判断角色是否已存在
*/
export const doRoleAddExist = async (ctx: Context, next: Next) => {
  const flag = await isExistRole(ctx.params.code, 'code')
  if (flag)
    throw new ExceptionParameter({ message: Message.existRole })
  await next()
}

/**
 * 修改时 判断角色是否不存在，若修改 code 再判断 code 是否存在
*/
export async function doRoleUpdateNoExist(ctx: Context, next: Next) {
  const flag = await isExistRole(ctx.params.id)
  if (!flag)
    throw new ExceptionParameter({ message: Message.unexistRole })
  if (ctx.params.code) {
    const sql = `SELECT id FROM roles WHERE code = ? AND id != ?`
    const data = [ctx.params.code, ctx.params.id]
    const res: any = await query(sql, data)
    if (res && res.length)
      throw new ExceptionParameter({ message: Message.existRole })
  }
  await next()
}

/**
 * 删除时 判断角色是否不存在
*/
export async function doRoleDeleteNoExist(ctx: Context, next: Next) {
  const isExist = await isExistRole(ctx.params.id)
  if (!isExist)
    throw new ExceptionParameter({ message: Message.unexistRole })
  await next()
}

// 根据 id 判断角色是否存在
export async function isExistRole(value: any, key: string = 'id'): Promise<boolean> {
  const sql = `SELECT id FROM roles WHERE ${key} = ?`
  const res: any = await query(sql, value)
  if (res && res.length) return true
  return false
}
