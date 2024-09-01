/**
 * @description 博客文章修改
 * @author chen
 * @update 2021-08-07 15:15:08
 */

import { Context } from 'koa'
import { Success } from '@/utils/http-exception'
import { execTrans, getUpdateFields } from '@/db'
import { formatDate } from '@/utils/tools'
import { SQLOptions } from '@/db/interface'

/**
 * 博客文章修改
 */
export const doArticleUpdate = async (ctx: Context) => {
  ctx._params.updateTime = formatDate(new Date())
  const fieldsResult = getUpdateFields({
    valid: [
      'title',
      'content',
      'content_type',
      'type',
      'is_draft',
      'cover_img',
      'attachment',
      'classify',
      'is_secret',
      'sort',
      'update_time',
      'remarks'
    ],
    data: ctx._params
  })
  const sql: string = `UPDATE articles SET ${fieldsResult.sql} WHERE id = ?`
  const data = [...fieldsResult.data, ctx._params.id]
  const sqlList: SQLOptions[] = [{ sql, data }]
  // 同步更新文件公开性
  if (ctx._params.hasOwnProperty('isSecret')) {
    const sql1: string = `
      UPDATE files_info 
        t1 SET t1.is_secret = ? 
      WHERE 
        t1.create_user = ? AND
        (
          FIND_IN_SET (t1.id, (SELECT t2.cover_img FROM articles t2 WHERE t2.id = ?)) OR 
          FIND_IN_SET (t1.id, (SELECT t3.attachment FROM articles t3 WHERE t3.id = ?))
        )`
    const data1 = [ctx._params.isSecret, ctx._params.id, ctx._params.id, ctx._user.id]
    sqlList.push({ sql: sql1, data: data1, noThrow: true })
  }
  await execTrans(sqlList)
  throw new Success()
}
