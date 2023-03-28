/**
 * @description 笔记关联模块新增
 * @author cpl
 * @create 2023-02-07 14:25:15
 */

import { query } from '@/db'
import { Terminal } from '@/enums'
import { Success } from '@/utils/http-exception'
import { formatDate, getUuId } from '@/utils/tools'
import { Context } from 'koa'

/*
 * 笔记关联新增
 */
export const doNovelNoteLinkAdd = async (ctx: Context) => {
  const params = ctx._params
  let sql: string = ''
  let data: any[] = []
  if (params.__status === '-1') {
    sql =
      'INSERT novels_note_link (id, status, note_id, target_id, target_type, share, create_time, terminal) VALUES (?, ?, ?, ?, ?, ?, ?, ?)'
    data = [
      getUuId(),
      '1',
      params.noteId,
      params.targetId,
      params.targetType,
      params.share,
      formatDate(new Date()),
      Terminal[ctx._terminal]
    ]
  } else {
    sql = 'UPDATE novels_note_link SET status = ? WHERE note_id = ? AND target_id = ?'
    data = ['1', params.noteId, params.targetId]
  }
  await query(sql, data)
  throw new Success()
}
