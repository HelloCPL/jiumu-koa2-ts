/**
 * @description 点赞新增
 * @author chen
 * @update 2021-08-07 15:15:08
 */

import { Context } from 'koa'
import { Success } from '@/utils/http-exception'
import { query } from '@/db'
import { Terminal } from '@/enums'
import { formatDate, getUuId } from '@/utils/tools'

/**
 * 点赞新增
 */
export const doLikeAdd = async (ctx: Context) => {
  const sql: string =
    'INSERT likes (id, target_id, create_user, type, create_time, terminal) VALUES (?, ?, ?, ?, ?, ?)'
  const id = getUuId()
  const data = [
    id,
    ctx._params.targetId,
    ctx._user.id,
    ctx._params.type,
    formatDate(new Date()),
    Terminal[ctx._terminal]
  ]
  await query(sql, data)
  throw new Success({ data: id })
}
