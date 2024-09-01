/**
 * @description 登录记录模块新增
 * @author chen
 * @update 2021-08-07 15:15:08
 */
import { Context, Next } from 'koa'
import { query } from '@/db'
import { formatDate, getUuId } from '@/utils/tools'
import { getTerminal, getIP } from '@/utils/tools'
import { Terminal } from '@/enums'

// 新增登录记录信息
export const doLoginInfoAdd = async (ctx: Context, next: Next, userId: string) => {
  const terminal = getTerminal(ctx)
  const sql: string = `
    INSERT login_info 
      (id, user_id, user_agent, ip, create_time, terminal) 
    VALUES 
      (?, ?, ?, ?, ?, ?)`
  const data = [
    getUuId(),
    userId,
    ctx.request.header['user-agent'],
    getIP(ctx),
    formatDate(new Date()),
    Terminal[terminal]
  ]
  await query(sql, data)
  next()
}
