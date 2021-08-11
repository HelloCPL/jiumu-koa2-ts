/**
 * @description 用户注册方法
 * @author chen
 * @update 2021-08-07 15:15:08
*/

import { Context, Next } from "koa";
import { Message, Terminal } from '../../../enums'
import { Success } from '../../../utils/http-exception'
import { gernerateToken } from './token'
import Config from '../../../config'
import { getUuId, formatDate } from '../../../utils/tools'
import { encrypt } from '../../../utils/crypto'
import { query } from '../../../db/index'

/**
 * 用户注册
*/
export const doUserRegister = async (ctx: Context, next: Next) => {
  const id = getUuId()
  const password = encrypt(ctx.params.password)
  const currentTime = formatDate(new Date())
  const sql = `INSERT users (id, password, phone,username, create_time, update_time, terminal) VALUES (?,?,?,?,?,?,?)`
  const data = [id, password, ctx.params.phone, '匿名', currentTime, currentTime, Terminal[ctx.terminal]]
  await query(sql, data)
  // 生成 token
  const tokenParams = {
    id,
    phone: ctx.params.phone,
    validTime: Config.TOKEN.VALID_TIME,
    key: 'token'
  }
  const token = await gernerateToken(ctx, tokenParams)
  // 生成刷新 token
  const tokenRefreshParams = {
    id,
    phone: ctx.params.phone,
    validTime: Config.TOKEN.REFRESH_VALID_TIME,
    key: 'token_refresh'
  }
  const tokenRefresh = await gernerateToken(ctx, tokenRefreshParams)
  throw new Success({ message: Message.register, data: { token, tokenRefresh } })
}