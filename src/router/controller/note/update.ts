/**
 * 笔记修改
 */

import { getUpdateFields, query } from '@/db'
import { Success } from '@/utils/http-exception'
import { formatDate } from '@/utils/tools'
import { Context } from 'koa'

export const doNoteUpdate = async (ctx: Context) => {
  ctx._params.updateTime = formatDate(new Date())
  const fieldsResult = getUpdateFields({
    valid: [
      'root_id',
      'target_id',
      'title',
      'content',
      'classify',
      'sort',
      'is_secret',
      'link_status',
      'update_time',
      'remarks'
    ],
    data: ctx._params
  })
  const sql: string = `UPDATE notes SET ${fieldsResult.sql} WHERE id = ?`
  const data = [...fieldsResult.data, ctx._params.id]
  await query(sql, data)
  throw new Success()
}
