/**
 * @description 笔记删除
 * @author chen
 * @update 2021-08-07 15:15:08
 */

import { Context } from 'koa'
import { Success } from '@/utils/http-exception'
import { execTrans } from '@/db'

/**
 * 笔记删除
 */
export const doNovelNoteDelete = async (ctx: Context) => {
  const sql: string = 'DELETE FROM novels_note WHERE id = ?'
  const data = [ctx._params.id]
  const sql2 = 'DELETE FROM novels_note_link WHERE note_id = ?'
  // 同步删除已关联的笔记
  await execTrans([
    { sql, data },
    { sql: sql2, data }
  ])
  throw new Success()
}
