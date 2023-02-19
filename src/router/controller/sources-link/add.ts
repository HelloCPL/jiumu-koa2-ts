/**
 * @describe: 资源的外部资源信息新增
 * @author: cpl
 * @create: 2023-02-19 14:38:02
 */

import { query } from '@/db'
import { Terminal } from '@/enums'
import { Success } from '@/utils/http-exception'
import { formatDate, getUuId } from '@/utils/tools'
import { Context } from 'koa'

/**
 * 资源的外部资源信息新增
 */
export const doSourceLinkAdd = async (ctx: Context) => {
  const params = ctx._params
  const currentTime = formatDate(new Date())
  const sql: string =
    'INSERT sources_link (id, title, link, cover_img1, cover_img2, sort, create_user, create_time, update_time, terminal, remarks) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
  const id = getUuId()
  const data = [
    id,
    params.title,
    params.link,
    params.cover_img1,
    params.cover_img2,
    params.sort || 1,
    ctx._user.id,
    currentTime,
    currentTime,
    Terminal[ctx._terminal],
    params.remarks
  ]
  await query(sql, data)
  throw new Success({ data: id })
}
