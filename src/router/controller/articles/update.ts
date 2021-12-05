/**
 * @description 博客文章修改
 * @author chen
 * @update 2021-08-07 15:15:08
*/

import { Context, Next } from "koa";
import { Success } from '../../../utils/http-exception'
import { query } from "../../../db";
import { formatDate } from "../../../utils/tools";
import { getUpdateSetData } from '../../../utils/handle-sql'

/**
 * 博客文章修改
*/
export const doArticleUpdate = async (ctx: Context, next: Next) => {
  ctx.params.updateTime = formatDate(new Date())
  const sqlParams = getUpdateSetData({
    valid: ['title', 'content', 'content_type', 'type', 'is_draft', 'cover_img', 'attachment', 'classify', 'is_secret', 'sort', 'update_time', 'remarks'],
    data: ctx.params
  })
  const sql: string = `UPDATE articles SET ${sqlParams.sql} WHERE id = ?`
  const data = [...sqlParams.data, ctx.params.id]
  await query(sql, data)
  throw new Success();
}
