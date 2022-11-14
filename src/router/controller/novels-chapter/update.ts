/**
 * @description 小说章节修改
 * @author chen
 * @update 2021-08-07 15:15:08
 */

import { Context, Next } from 'koa'
import { Success } from '@/utils/http-exception'
import { query } from '@/db'
import { formatDate } from '@/utils/tools'
import { getUpdateSetData } from '@/utils/handle-sql'

/**
 * 小说章节修改
 */
export const doNovelChapterUpdate = async (ctx: Context, next: Next) => {
  ctx._params.updateTime = formatDate(new Date())
  const sqlParams = getUpdateSetData({
    valid: ['title', 'content', 'sort', 'is_draft', 'is_secret', 'update_time', 'remarks'],
    data: ctx._params
  })
  const sql: string = `UPDATE novels_chapter SET ${sqlParams.sql} WHERE id = ?`
  const data = [...sqlParams.data, ctx._params.id]
  await query(sql, data)
  throw new Success()
}
