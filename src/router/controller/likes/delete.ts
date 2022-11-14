/**
 * @description 点赞删除
 * @author chen
 * @update 2021-08-07 15:15:08
 */

import { Context, Next } from 'koa'
import { Success } from '@/utils/http-exception'
import { query } from '@/db'

/**
 * 点赞删除
 */
export const doLikeDelete = async (ctx: Context, next: Next) => {
  const sql: string = `DELETE FROM likes WHERE target_id = ? AND create_user = ?`
  const data = [ctx._params.targetId, ctx._user.id]
  await query(sql, data)
  throw new Success()
}
