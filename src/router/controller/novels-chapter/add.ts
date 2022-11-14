/**
 * @description 小说章节新增
 * @author chen
 * @update 2021-08-07 15:15:08
 */

import { Context, Next } from 'koa'
import { Success } from '@/utils/http-exception'
import { query } from '@/db'
import { Terminal } from '@/enums'
import { formatDate, getUuId } from '@/utils/tools'
import { validateRange } from '@/utils/validator'

/**
 * 小说章节新增
 */
export const doNovelChapterAdd = async (ctx: Context, next: Next) => {
  const paramsData = await validateRange(
    [
      { value: ctx._params.isDraft, range: ['1', '0'], default: '0' },
      { value: ctx._params.isSecret, range: ['1', '0'], default: '0' }
    ],
    true
  )
  const sql: string = `INSERT novels_chapter (id, novel_id, title, content, sort, is_secret, is_draft, create_user, create_time, update_time, terminal, remarks) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
  let currentTime = formatDate(new Date())
  const data = [
    getUuId(),
    ctx._params.novelId,
    ctx._params.title,
    ctx._params.content,
    ctx._params.sort,
    paramsData[1],
    paramsData[0],
    ctx._user.id,
    currentTime,
    currentTime,
    Terminal[ctx._terminal],
    ctx._params.remarks
  ]
  await query(sql, data)
  throw new Success()
}
