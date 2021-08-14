/**
 * @description 用户模块中间件
 * @author chen
 * @update 2021-08-07 15:12:57
*/

import { Context, Next } from 'koa'
import { Message } from '../../../enums'
import { isExist } from '../convert'

/**
 * 注册
 * 判断用户是否已存在
*/
export const doUserRegisterConvert = async (ctx: Context, next: Next) => {
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
export async function doUserLoginConvert(ctx: Context, next: Next) {
  // 判断用户是否不存在
  await isExist({
    table: 'users',
    where: [{ key: 'phone', value: ctx.params.phone }],
    throwType: false,
    message: Message.unexistUser
  })
  await next()
}
