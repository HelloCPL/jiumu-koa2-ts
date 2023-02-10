/**
 * @description 笔记关联模块删除
 * @author cpl
 * @create 2023-02-07 14:37:12
 */

import { query } from '@/db'
import { Success } from '@/utils/http-exception'
import { Context } from 'koa'

/*
 * 笔记关联删除
 */
export const doNovelNoteLinkDelete = async (ctx: Context) => {
  const sql: string = 'DELETE FROM novels_note_link WHERE id = ? OR (note_id = ? AND target_id = ?)'
  const data = [ctx._params.id, ctx._params.noteId, ctx._params.targetId]
  await query(sql, data)
  throw new Success()
}
