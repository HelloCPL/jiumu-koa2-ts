/**
 * @description 菜单修改
 * @author chen
 * @update 2021-08-07 15:15:08
 */

import { Context, Next } from 'koa'
import { Success } from '@/utils/http-exception'
import { query } from '@/db'
import { formatDate } from '@/utils/tools'
import { getUpdateSetData } from '@/utils/handle-sql'

/**
 * 菜单修改
 */
export const doMenuUpdate = async (ctx: Context, next: Next) => {
  ctx._params.updateTime = formatDate(new Date())
  const sqlParams = getUpdateSetData({
    valid: ['code', 'parent_code', 'label', 'sort', 'update_time', 'remarks'],
    data: ctx._params
  })
  const sql: string = `UPDATE menus SET ${sqlParams.sql} WHERE id = ?`
  const data = [...sqlParams.data, ctx._params.id]
  await query(sql, data)
  throw new Success()
}
