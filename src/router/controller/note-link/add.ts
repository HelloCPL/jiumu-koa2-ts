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
export const doNoteLinkAdd = async (ctx: Context) => {
  const params = ctx._params
  const currentTime = formatDate(new Date())
  const sql = `
    INSERT notes_link 
      (id, note_id, target_id, create_user, create_time, terminal) 
    VALUES 
      (?, ?, ?, ?, ?, ?)`
  const data = [getUuId(), params.noteId, params.targetId, ctx._user.id, currentTime, Terminal[ctx._terminal]]
  await query(sql, data)
  throw new Success()
}
