/**
 * @description 笔记删除
 * @author chen
 * @update 2021-08-07 15:15:08
 */

import { Context } from 'koa'
import { Success } from '@/utils/http-exception'
import { query } from '@/db'

/**
 * 笔记删除
 */
export const doNovelNoteDelete = async (ctx: Context) => {
  const sql: string = 'DELETE FROM novels_note WHERE id = ?'
  await query(sql, ctx._params.id)
  throw new Success()
}
