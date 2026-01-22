/**
 * @description 小说章节新增
 * @author chen
 * @update 2021-08-07 15:15:08
 */

import { Context } from 'koa'
import { Success } from '@/utils/http-exception'
import { query } from '@/db'
import { Terminal } from '@/enums'
import { formatDate, getUuId } from '@/utils/tools'

/**
 * 小说章节新增
 */
export const doNovelChapterAdd = async (ctx: Context) => {
  const sql: string = `
    INSERT novels_chapter 
      (id, novel_id, title, content, sort, is_secret, is_draft, create_user, create_time, update_time, terminal, remarks) 
    VALUES 
      (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
  const currentTime = formatDate(new Date())
  const id = getUuId()
  const data = [
    id,
    ctx._params.novelId,
    ctx._params.title,
    ctx._params.content,
    ctx._params.sort,
    ctx._params.isSecret,
    ctx._params.isDraft,
    ctx._user.id,
    currentTime,
    currentTime,
    Terminal[ctx._terminal],
    ctx._params.remarks
  ]
  await query(sql, data)
  throw new Success({ data: id })
}
