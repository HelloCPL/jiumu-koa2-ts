/**
 * @description 用户注册方法
 * @author chen
 * @update 2021-08-07 15:15:08
*/

import { Context, Next } from "koa";
import { Message, Terminal } from '../../../enums'
import { Success } from '../../../utils/http-exception'
import { gernerateToken } from './token'
import { TOKEN } from '../../../config'
import { getUuId, formatDate } from '../../../utils/tools'
import { encrypt } from '../../../utils/crypto'
import { query } from '../../../db/index'
import { doLoginInfoAdd } from '../login-info/add'

/**
 * 用户注册
*/
export const doUserRegister = async (ctx: Context, next: Next) => {
  const id = getUuId()
  const password = encrypt(ctx._params.password)
  const currentTime = formatDate(new Date())
  const sql = `INSERT users (id, password, phone,username, create_time, update_time, terminal) VALUES (?,?,?,?,?,?,?)`
  const data = [id, password, ctx._params.phone, '匿名', currentTime, currentTime, Terminal[ctx._terminal]]
  await query(sql, data)
  // 生成双 token
  let params = { userId: id, phone: ctx._params.phone }
  const doubleToken = await handleDoubleToken(ctx, params)
  // 记录登录状态
  await doLoginInfoAdd(ctx, next, id)
  throw new Success({ message: Message.register, data: doubleToken })
}

interface DoubleTokenParams {
  userId: string,
  phone: string
}

export interface DoubleTokenReturn {
  token: string,
  tokenRefresh: string
}

// 生成双token
export const handleDoubleToken = async (ctx: Context, options: DoubleTokenParams): Promise<DoubleTokenReturn> => {
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
