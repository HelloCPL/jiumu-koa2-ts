/**
 * @description 用户登录方法
 * @author chen
 * @update 2021-08-07 15:15:08
*/

import { Context, Next } from "koa";
import { Success, ExceptionParameter } from '../../../utils/http-exception'
import { gernerateToken } from './token'
import { decrypt } from '../../../utils/crypto'
import { query } from "../../../db";
import { Message } from "../../../enums";
import Config from '../../../config'

/**
 * 用户登录
*/
export const doUserLogin = async (ctx: Context, next: Next) => {
  const password: string = ctx.params.password
  const phone: string = ctx.params.phone
  const sql: string = `SELECT id, password FROM users WHERE phone = ?`
  const res: any = await query(sql, phone)
  const originPassowrd: string = decrypt(res[0]['password'])
  if (password && originPassowrd && password === originPassowrd) {
    // 生成 token
    const tokenParams = {
      id: res[0]['id'],
      phone,
      validTime: Config.TOKEN.VALID_TIME,
      key: 'token'
    }
    const token = await gernerateToken(ctx, tokenParams)
    // 生成刷新 token
    const tokenRefreshParams = {
      id: res[0]['id'],
      phone,
      validTime: Config.TOKEN.REFRESH_VALID_TIME,
      key: 'token_refresh'
    }
    const tokenRefresh = await gernerateToken(ctx, tokenRefreshParams)
    throw new Success({ message: Message.login, data: { token, tokenRefresh } })
  } else throw new ExceptionParameter({ message: Message.errorPassword })
}
