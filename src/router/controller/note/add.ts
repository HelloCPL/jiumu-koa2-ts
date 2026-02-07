/**
 * 笔记新增
 */

import { query } from '@/db'
import { Terminal } from '@/enums'
import { Success } from '@/utils/http-exception'
import { formatDate, getUuId } from '@/utils/tools'
import { Context } from 'koa'

export const doNoteAdd = async (ctx: Context) => {
  const params = ctx._params
  const currentTime = formatDate(new Date())
  const sort: number = params.sort || 1
  const sql: string = `
    INSERT notes 
      (id, root_id, target_id, title, content, classify, sort, is_secret,  create_user, create_time, update_time, terminal, remarks) 
    VALUES 
     (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
  const data = [
    getUuId(),
    params.rootId,
    params.targetId,
    params.title,
    params.content,
    params.classify,
    sort,
    params.isSecret,
    ctx._user.id,
    currentTime,
    currentTime,
    Terminal[ctx._terminal],
    params.remarks
  ]
  await query(sql, data)
  throw new Success()
}
