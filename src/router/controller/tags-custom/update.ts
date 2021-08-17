/**
 * @description 用户自定义标签修改
 * @author chen
 * @update 2021-08-07 15:15:08
*/

import { Context, Next } from "koa";
import { Success } from '../../../utils/http-exception'
import { query } from "../../../db";
import { formatDate } from "../../../utils/tools";
import { getUpdateSetData } from '../../../utils/handle-sql'

/**
 * 用户自定义标签修改
*/
export const doTagCustomUpdate = async (ctx: Context, next: Next) => {
  ctx.params.updateTime = formatDate(new Date())
  const sqlParams = getUpdateSetData({
    valid: ['label', 'sort', 'update_time'],
    data: ctx.params
  })
  const sql: string = `UPDATE tags_custom SET ${sqlParams.sql} WHERE id = ? AND create_user = ?`
  const data = [...sqlParams.data, ctx.params.id, ctx.user.id]
  await query(sql, data)
  throw new Success();
}
