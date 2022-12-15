/**
 * @description 用户登录方法
 * @author chen
 * @update 2021-08-07 15:15:08
 */

import { Context } from 'koa'
import { Success, ExceptionParameter } from '@/utils/http-exception'
import { decrypt } from '@/utils/crypto'
import { query } from '@/db'
import { Message, Terminal } from '@/enums'
import { handleDoubleToken } from './register'
import { getUuId, getIP, formatDate } from '@/utils/tools'

/**
 * 用户登录
 */
export const doUserLogin = async (ctx: Context) => {
  const password: string = ctx._params.password
  const phone: string = ctx._params.phone
  // 校验账号
  const sql: string = 'SELECT id, password FROM users WHERE phone = ?'
  const res: any = await query(sql, phone)
  if (res.length) {
    const originPassowrd: string = decrypt(res[0]['password'])
    if (password && originPassowrd && password === originPassowrd) {
      // 生成双 token
      const params = { userId: res[0]['id'], phone: phone }
      const doubleToken = await handleDoubleToken(ctx, params)
      // 记录登录状态
      const sql3 =
        'INSERT login_info (id, user_id, user_agent, ip, create_time, terminal) VALUES (?, ?, ?, ?, ?, ?)'
      const data3 = [
        getUuId(),
        res[0]['id'],
        ctx.request.header['user-agent'],
        getIP(ctx),
        formatDate(new Date()),
        Terminal[ctx._terminal]
      ]
      await query(sql3, data3)
      throw new Success({ message: Message.login, data: doubleToken })
    } else throw new ExceptionParameter({ message: Message.errorPassword })
  } else throw new ExceptionParameter({ message: Message.unexistUser })
}
