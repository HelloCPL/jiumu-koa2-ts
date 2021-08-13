/**
 * @description 用户模块中间件
 * @author chen
 * @update 2021-08-07 15:12:57
*/

import { Context, Next } from 'koa'
import { query } from '../../../db'
import { Message } from '../../../enums'
import { isExist } from '../convert'

/**
 * 注册
 * 判断用户是否已存在
*/
export const doUserRegisterExist = async (ctx: Context, next: Next) => {
  // 判断用户是否已存在
  await isExist({
    table: 'users',
    where: [{ key: 'phone', value: ctx.params.phone }],
    throwType: true,
    message: Message.existUser
  })
  await next()
}

/**
 * 登录
 * 判断用户是否不存在
*/
export async function doUserLoginNoExist(ctx: Context, next: Next) {
  // 判断用户是否不存在
  await isExist({
    table: 'users',
    where: [{ key: 'phone', value: ctx.params.phone }],
    throwType: false,
    message: Message.unexistUser
  })
  await next()
}








/**
 * 根据 电话 或 id 判断用户是否存在
*/
export async function isExistUser(value: string, key: string = 'phone'): Promise<boolean> {
  let sql = `SELECT id FROM users WHERE ${key} = ?`
  const res: any = await query(sql, value)
  if (res && res.length) return true
  return false
}