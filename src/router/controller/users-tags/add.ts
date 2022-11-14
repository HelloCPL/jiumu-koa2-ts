/**
 * @description 用户-特殊标签关联新增
 * @author chen
 * @update 2021-08-07 15:15:08
 */

import { Context } from 'koa'
import { Success } from '@/utils/http-exception'
import { query } from '@/db'
import { Terminal } from '@/enums'
import { formatDate, getUuId } from '@/utils/tools'

/**
 * 用户-特殊标签关联新增
 */
export const doUserTagAdd = async (ctx: Context) => {
  const sql: string = 'INSERT users_tags (id, tag_code, user_id, create_time, terminal) VALUES (?, ?, ?, ?, ?)'
  const data = [getUuId(), ctx._params.tagCode, ctx._params.userId, formatDate(new Date()), Terminal[ctx._terminal]]
  await query(sql, data)
  throw new Success()
}
