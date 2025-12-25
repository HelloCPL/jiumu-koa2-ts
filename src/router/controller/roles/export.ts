/**
 * @description 角色导出
 * @author chen
 * @update 2021-08-07 15:15:08
 */

import { Context } from 'koa'
import { query } from '@/db'
import { toStringify } from '@/utils/tools'

/**
 * 角色导出
 */
export const doRoleExport = async (ctx: Context) => {
  const ids: string = ctx._params.ids
  const sql: string = `
    SELECT 
      t1.id, t1.code, t1.label, t1.sort, t1.configurable, 
      t1.create_time, t1.update_time, t1.terminal, t1.remarks 
    FROM roles t1 
    WHERE FIND_IN_SET(t1.id, ?)`
  const data = [ids]
  const res = await query(sql, data)
  ctx.set('Content-Type', 'application/json; charset=utf-8')
  ctx.set('Content-Disposition', `attachment; filename="roles-export-${Date.now()}.json"`)
  ctx.set('Cache-Control', 'no-cache, no-store, must-revalidate')
  ctx.set('Pragma', 'no-cache')
  ctx.set('Expires', '0')
  const jsonStr = toStringify(res)
  const buffer = Buffer.from(jsonStr, 'utf8')
  ctx.set('Content-Length', buffer.length.toString())
  ctx.body = buffer
}
