/**
 * @description 用户登录方法
 * @author chen
 * @update 2021-08-07 15:15:08
*/

import { Context, Next } from "koa";
import { Success, ExceptionParameter } from '../../../utils/http-exception'
import { decrypt } from '../../../utils/crypto'
import { query } from "../../../db";
import { Message } from "../../../enums";
import { handleDoubleToken } from './register'
import { doLoginInfoAdd } from '../login-info/add'

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
    // 生成双 token
    let params = { userId: res[0]['id'], phone: phone }
    const doubleToken = await handleDoubleToken(ctx, params)
    // 记录登录状态
    await doLoginInfoAdd(ctx, next, res[0]['id'])
    throw new Success({ message: Message.login, data: doubleToken })
  } else throw new ExceptionParameter({ message: Message.errorPassword })
}
