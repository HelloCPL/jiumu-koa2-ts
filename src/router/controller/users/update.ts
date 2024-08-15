/**
 * @description 用户修改基本信息
 * @author chen
 * @update 2021-08-07 15:15:08
 */

import { Context } from 'koa'
import { Success, ExceptionForbidden } from '@/utils/http-exception'
import { query, getUpdateFields } from '@/db'
import { formatDate } from '@/utils/tools'
import { analysisToken } from './token'
import { Code, Message } from '@/enums'
import { handleDoubleToken } from './register'

/**
 * 修改本用户基本信息
 */
export const doUserUpdateBaseSelf = async (ctx: Context) => {
  await updateUserBaseByUserId(ctx, ctx._user.id)
  throw new Success()
}

/**
 * 修改指定用户基本信息
 */
export const doUserUpdateBase = async (ctx: Context) => {
  await updateUserBaseByUserId(ctx, ctx._params.id)
  throw new Success()
}

/**
 * 更新token
 */
export const doUserUpdateToken = async (ctx: Context) => {
  const tokenRefresh = await analysisToken(ctx, 'token_refresh')
  if (tokenRefresh.code === Code.success) {
    // 生成双 token
    const params = { userId: tokenRefresh.data.id, phone: tokenRefresh.data.phone }
    const doubleToken = await handleDoubleToken(ctx, params)
    throw new Success({ data: doubleToken })
  } else throw new ExceptionForbidden({ message: Message.authLogin, code: Code.authLogin })
}

// 根据 userId 修改指定用户基本信息
export const updateUserBaseByUserId = async (ctx: Context, userId: string): Promise<void> => {
  ctx._params.updateTime = formatDate(new Date())
  const sqlParams = getUpdateFields({
    valid: ['username', 'sex', 'birthday', 'avatar', 'professional', 'address', 'update_time', 'remarks'],
    data: ctx._params
  })
  const sql: string = `UPDATE users SET ${sqlParams.sql} WHERE id = ?`
  const data = [...sqlParams.data, userId]
  await query(sql, data)
}
