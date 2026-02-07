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
  throw new Success()
}
