/**
 * @describe: 资源的外部资源信息修改
 * @author: cpl
 * @create: 2023-02-19 14:49:27
 */

import { Context } from 'koa'
import { Success } from '@/utils/http-exception'
import { query, getUpdateFields } from '@/db'
import { formatDate } from '@/utils/tools'

/**
 * 资源的外部资源信息修改
 */
export const doSourceLinkUpdate = async (ctx: Context) => {
  ctx._params.updateTime = formatDate(new Date())
  const sqlParams = getUpdateFields({
    valid: ['title', 'link', 'cover_img1', 'cover_img2', 'sort', 'update_time', 'remarks'],
    data: ctx._params
  })
  const sql: string = `UPDATE sources_link SET ${sqlParams.sql} WHERE id = ?`
  const data = [...sqlParams.data, ctx._params.id]
  await query(sql, data)
  throw new Success()
}
