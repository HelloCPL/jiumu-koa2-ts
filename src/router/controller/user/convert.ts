/**
 * @description 用户模块中间件
 * @author chen
 * @update 2021-08-07 15:12:57
*/

import { Context, Next } from 'koa'

/**
 * 根据电话 注册判断用户是否已存在
*/
export const doUserRegisterIsExist = async (ctx: Context, next: Next) => {
  // let flag = await isExistUser(ctx.data.body.phone)
  // if (flag)
  //   throw new global.ExceptionParameter({ message: '该用户已存在' })
  console.log('不存在');
  await next()
}