/**
 * @description 用户-特殊标签关联删除
 * @author chen
 * @update 2021-08-07 15:15:08
 */

import { Context } from 'koa'
import { Success } from '@/utils/http-exception'
import { query } from '@/db'

/**
 * 用户-特殊标签关联删除
 */
export const doUserTagDelete = async (ctx: Context) => {
  const sql: string = 'DELETE FROM users_tags WHERE id = ? OR (tag_code = ? AND user_id = ?)'
  const data = [ctx._params.id, ctx._params.tagCode, ctx._params.userId]
  await query(sql, data)
  throw new Success()
}
