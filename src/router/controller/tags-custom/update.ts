/**
 * @description 用户自定义标签修改
 * @author chen
 * @update 2021-08-07 15:15:08
 */

import { Context } from 'koa'
import { Success } from '@/utils/http-exception'
import { query } from '@/db'
import { formatDate } from '@/utils/tools'
import { getUpdateSetData } from '@/utils/handle-sql'

/**
 * 用户自定义标签修改
 */
export const doTagCustomUpdate = async (ctx: Context) => {
  ctx._params.updateTime = formatDate(new Date())
  const sqlParams = getUpdateSetData({
    valid: ['label', 'sort', 'type', 'update_time'],
    data: ctx._params
  })
  const sql: string = `UPDATE tags_custom SET ${sqlParams.sql} WHERE id = ? AND create_user = ?`
  const data = [...sqlParams.data, ctx._params.id, ctx._user.id]
  await query(sql, data)
  throw new Success()
}
