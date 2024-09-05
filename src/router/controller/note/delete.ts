/**
 * 笔记删除
 */

import { query } from '@/db'
import { Success } from '@/utils/http-exception'
import { Context } from 'koa'

export const doNoteDelete = async (ctx: Context) => {
  const sql1: string = 'DELETE FROM notes WHERE id = ?'
  const data = [ctx._params.id]
  // 删除笔记
  await query(sql1, data)
  // 如果存在关联的笔记，也需要删除
  const sql2 = 'SELECT id FROM notes_link WHERE note_id = ?'
  const res = await query(sql2, data)
  if (res && res.length) {
    const sql3 = 'DELETE FROM notes_link WHERE note_id = ?'
    await query(sql3, data)
  }
  throw new Success()
}
