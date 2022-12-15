/**
 * @description 用户修改手机号/密码
 * @author chen
 * @update 2021-08-07 15:15:08
 */

import { Context } from 'koa'
import { Success } from '@/utils/http-exception'
import { query } from '@/db'
import { encrypt } from '@/utils/crypto'
import { handleDoubleToken } from './register'

/**
 * 修改本用户账号
 */
export const doUserUpdatePhoneSelf = async (ctx: Context) => {
  const sql = 'UPDATE users SET phone = ? where id = ?'
  const data = [ctx._params.phone, ctx._user.id]
  await query(sql, data)
  // 生成双 token
  const params = { userId: ctx._user.id, phone: ctx._params.phone }
  const doubleToken = await handleDoubleToken(ctx, params)
  throw new Success({ data: doubleToken })
}

/**
 * 修改本用户密码
 */
export const doUserUpdatePasswordSelf = async (ctx: Context) => {
  const newPassword = encrypt(ctx._params.newPassword)
  const sql = 'UPDATE users SET password = ? where id = ?'
  const data = [newPassword, ctx._user.id]
  await query(sql, data)
  throw new Success()
}
