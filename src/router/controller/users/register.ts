/**
 * @description 用户注册方法
 * @author chen
 * @update 2021-08-07 15:15:08
 */

import { Context } from 'koa'
import { Message, Terminal } from '@/enums'
import { Success } from '@/utils/http-exception'
import { gernerateToken } from './token'
import { TOKEN } from '@/config'
import { getUuId, formatDate, getIP } from '@/utils/tools'
import { encrypt } from '@/utils/crypto'
import { execTrans } from '@/db/index'

/**
 * 用户注册
 */
export const doUserRegister = async (ctx: Context) => {
  const userId = getUuId()
  const userRoleId = getUuId()
  const loginInfoId = getUuId()
  const password = encrypt(ctx._params.password)
  const currentTime = formatDate(new Date())
  const terminal = Terminal[ctx._terminal]
  // 注册账号
  const sql1 =
    'INSERT users (id, password, phone,username, create_time, update_time, terminal) VALUES (?,?,?,?,?,?,?)'
  const data1 = [userId, password, ctx._params.phone, '匿名', currentTime, currentTime, terminal]
  // 关联普通用户角色
  const sql2 =
    'INSERT users_roles (id, role_id, user_id, create_time, terminal) VALUES (?, (SELECT t1.id FROM roles t1 WHERE t1.code = ?), ?, ?, ?)'
  const data2 = [userRoleId, 'common', userId, currentTime, terminal]
  // 记录登录状态
  const sql3 =
    'INSERT login_info (id, user_id, user_agent, ip, create_time, terminal) VALUES (?, ?, ?, ?, ?, ?)'
  const data3 = [loginInfoId, userId, ctx.request.header['user-agent'], getIP(ctx), currentTime, terminal]
  await execTrans([
    { sql: sql1, data: data1 },
    { sql: sql2, data: data2 },
    { sql: sql3, data: data3 }
  ])
  // 生成双 token
  const params = { userId: userId, phone: ctx._params.phone }
  const doubleToken = await handleDoubleToken(ctx, params)
  throw new Success({ message: Message.register, data: doubleToken })
}

interface DoubleTokenParams {
  userId: string
  phone: string
}

export interface DoubleTokenReturn {
  token: string
  tokenRefresh: string
}

// 生成双token
export const handleDoubleToken = async (
  ctx: Context,
  options: DoubleTokenParams
): Promise<DoubleTokenReturn> => {
  const tokenParams = {
    id: options.userId,
    phone: options.phone,
    validTime: TOKEN.VALID_TIME,
    key: 'token'
  }
  const token = await gernerateToken(ctx, tokenParams)
  // 生成刷新 token
  const tokenRefreshParams = {
    id: options.userId,
    phone: options.phone,
    validTime: TOKEN.REFRESH_VALID_TIME,
    key: 'token_refresh'
  }
  const tokenRefresh = await gernerateToken(ctx, tokenRefreshParams)
  return { token, tokenRefresh }
}
