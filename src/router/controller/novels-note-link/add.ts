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
  const sql: string =
    'INSERT novels_note_link (id, note_id, target_id, target_type, share, create_time, terminal) VALUES (?, ?, ?, ?, ?, ?, ?)'
  const data = [
    getUuId(),
    ctx._params.noteId,
    ctx._params.targetId,
    ctx._params.targetType,
    ctx._params.share,
    formatDate(new Date()),
    Terminal[ctx._terminal]
  ]
  await query(sql, data)
  throw new Success()
}
