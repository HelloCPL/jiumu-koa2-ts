/**
 * @description 用户模块中间件
 * @author chen
 * @update 2021-08-07 15:12:57
*/

import { Context, Next } from 'koa'
import { query } from '../../../db'
import { ExceptionParameter } from '../../../utils/http-exception'
import { Message } from '../../../enums'

/**
 * 根据电话 注册判断用户是否已存在
*/
export const doUserRegisterIsExist = async (ctx: Context, next: Next) => {
  let flag = await isExistUser(ctx.params.phone)
  if (flag)
    throw new ExceptionParameter({ message: Message.userExist })
  await next()
}

/**
 * 根据电话 登录判断用户是否不存在
*/
export async function doUserLoginIsNotExist(ctx: Context, next: Next) {
  let flag = await isExistUser(ctx.params.phone)
  if (!flag)
    throw new ExceptionParameter({ message: Message.userUnExist })
  await next()
}

/**
 * 根据电话 判断用户是否存在
*/
export async function isExistUser(phone: any) {
  let sql = `SELECT id FROM users WHERE phone = ?`
  const res: any = await query(sql, phone)
  if (res && res.length) return true
  return false
}