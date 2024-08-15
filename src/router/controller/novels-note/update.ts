/**
 * @description 笔记修改
 * @author chen
 * @update 2021-08-07 15:15:08
 */

import { Context } from 'koa'
import { Success } from '@/utils/http-exception'
import { query, getUpdateFields } from '@/db'
import { formatDate } from '@/utils/tools'

/**
 * 笔记修改
 */
export const doNovelNoteUpdate = async (ctx: Context) => {
  ctx._params.updateTime = formatDate(new Date())
  const fieldsResult = getUpdateFields({
    valid: ['title', 'content', 'classify', 'is_secret', 'sort', 'update_time', 'remarks'],
    data: ctx._params
  })
  const sql: string = `UPDATE novels_note SET ${fieldsResult.sql} WHERE id = ?`
  const data = [...fieldsResult.data, ctx._params.id]
  await query(sql, data)
  throw new Success()
}
