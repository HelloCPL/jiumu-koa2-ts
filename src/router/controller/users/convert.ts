/**
 * @description 用户模块中间件
 * @author chen
 * @update 2021-08-07 15:12:57
 */

import { Context, Next } from 'koa'
import { Message } from '@/enums'
import { isExist } from '../convert'
import { validateRange } from '@/utils/validator'
import { query } from '@/db'
import { decrypt } from '@/utils/crypto'
import { ExceptionParameter } from '@/utils/http-exception'
/**
 * 注册
 * 判断用户是否已存在
 */
export const doUserRegisterConvert = async (ctx: Context, next: Next) => {
  // 判断用户是否已存在
  await isExist({
    table: 'users',
    where: [{ key: 'phone', value: ctx._params.phone }],
    throwType: true,
    message: Message.existUser
  })
  await next()
}

/**
 * 修改本用户/指定用户基本信息时
 * 如果传了 sex 判断是否为系统标签200范围
 */
export async function doUserUpdateBaseSelfConvert(ctx: Context, next: Next) {
  // 如果传了 sex 判断是否为系统标签200范围
  if (ctx._params.hasOwnProperty('sex')) {
    await validateRange({
      value: ctx._params.sex,
      range: '200',
      message: 'sex参数必须为系统标签200范围'
    })
  }
  await next()
}

/**
 * 仅指定用户基本信息时
 * 判断用户是否不存在
 */
export async function doUserUpdateBaseConvert(ctx: Context, next: Next) {
  // 判断用户是否不存在
  await isExist({
    table: 'users',
    where: [{ key: 'id', value: ctx._params.id }],
    throwType: false,
    message: Message.unexistUser
  })
  await next()
}

/**
 * 修改本用户密码
 * 校验密码是否正确
 */
export async function doUserCheckPasswordConvert(ctx: Context, next: Next) {
  const sql = 'SELECT id, password FROM users WHERE id = ?'
  const res: any = await query(sql, ctx._user.id)
  if (!(res && res.length)) {
    throw new ExceptionParameter({ message: Message.unexistUser })
  }
  const originPassowrd: string = decrypt(res[0]['password'])
  if (!(ctx._params.password && originPassowrd && ctx._params.password === originPassowrd))
    throw new ExceptionParameter({ message: Message.errorPassword })
  await next()
}
