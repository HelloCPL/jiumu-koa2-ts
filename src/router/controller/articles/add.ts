/**
 * @description 博客文章新增
 * @author chen
 * @update 2021-08-07 15:15:08
 */

import { Context, Next } from 'koa'
import { Success } from '@/utils/http-exception'
import { execTrans } from '@/db'
import { Terminal } from '@/enums'
import { formatDate, getUuId } from '@/utils/tools'
import { validateRange } from '@/utils/validator'
import { SQLOptions } from '@/db/interface'

/**
 * 博客文章新增
 */
export const doArticleAdd = async (ctx: Context, next: Next) => {
  const paramsData = await validateRange(
    [
      { value: ctx._params.isDraft, range: ['1', '0'], default: '0' },
      { value: ctx._params.isSecret, range: ['1', '0'], default: '0' }
    ],
    true
  )
  const sort: number = ctx._params.sort || 1
  const currentTime = formatDate(new Date())
  const params = ctx._params
  const sql: string = `INSERT articles (id, title, content, content_type, cover_img, attachment, type, classify, is_draft, is_secret, sort, create_user, create_time, update_time, terminal, remarks) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
  const data = [
    getUuId(),
    params.title,
    params.content,
    params.contentType,
    params.coverImg,
    params.attachment,
    params.type,
    params.classify,
    paramsData[0],
    paramsData[1],
    sort,
    ctx._user.id,
    currentTime,
    currentTime,
    Terminal[ctx._terminal],
    params.remarks
  ]
  // 保持图片和文章公开性质一致
  let sqlList: SQLOptions[] = [{ sql, data }]
  const sql1: string = `UPDATE files_info SET is_secret = ?, update_time = ? WHERE create_user = ? AND FIND_IN_SET(id, ?)`
  if (params.coverImg) {
    sqlList.push({
      sql: sql1,
      data: [paramsData[1], currentTime, ctx._user.id, params.coverImg],
      noThrow: true
    })
  }
  if (params.attachment) {
    sqlList.push({
      sql: sql1,
      data: [paramsData[1], currentTime, ctx._user.id, params.attachment],
      noThrow: true
    })
  }
  await execTrans(sqlList)
  throw new Success()
}
