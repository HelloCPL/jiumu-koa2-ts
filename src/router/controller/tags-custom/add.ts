/**
 * @description 用户自定义标签新增
 * @author chen
 * @update 2021-08-07 15:15:08
 */

import { Context } from 'koa'
import { Success } from '@/utils/http-exception'
import { query } from '@/db'
import { Terminal } from '@/enums'
import { formatDate, getUuId } from '@/utils/tools'

/**
 * 用户自定义标签新增
 */
export const doTagCustomAdd = async (ctx: Context) => {
  const sort: number = ctx._params.sort || 1
  const currentTime = formatDate(new Date())
  const sql: string =
    'INSERT tags_custom (id, label, sort, type, create_user, create_time, update_time, terminal) VALUES (?, ?, ?, ?, ?, ?, ?, ?)'
  const id = getUuId()
  const data = [
    id,
    ctx._params.label,
    sort,
    ctx._params.type,
    ctx._user.id,
    currentTime,
    currentTime,
    Terminal[ctx._terminal]
  ]
  await query(sql, data)
  throw new Success({ data: id })
}
