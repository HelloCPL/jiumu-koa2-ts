/**
 * @description 用户自定义标签删除
 * @author chen
 * @update 2021-08-07 15:15:08
 */

import { Context } from 'koa'
import { Success } from '@/utils/http-exception'
import { query } from '@/db'

/**
 * 用户自定义标签删除
 */
export const doTagCustomDelete = async (ctx: Context) => {
  const sql: string = 'DELETE FROM tags_custom WHERE id = ?'
  await query(sql, ctx._params.id)
  throw new Success()
}
