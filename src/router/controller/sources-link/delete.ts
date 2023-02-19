/**
 * @description 资源的外部资源信息新增删除
 * @author chen
 * @update 2021-08-07 15:15:08
 */

import { Context } from 'koa'
import { Success } from '@/utils/http-exception'
import { query } from '@/db'

/**
 * 资源的外部资源信息新增删除
 */
export const doSourceLinkDelete = async (ctx: Context) => {
  const sql: string = 'DELETE FROM sources_link WHERE id = ?'
  await query(sql, ctx._params.id)
  throw new Success()
}
