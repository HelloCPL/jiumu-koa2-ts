/**
 * @description 资源修改
 * @author chen
 * @update 2021-08-07 15:15:08
 */

import { Context } from 'koa'
import { Success } from '@/utils/http-exception'
import { execTrans, getUpdateFields } from '@/db'
import { formatDate } from '@/utils/tools'
import { SQLOptions } from '@/db/interface'

/**
 * 资源修改
 */
export const doSourceUpdate = async (ctx: Context) => {
  ctx._params.updateTime = formatDate(new Date())
  const fieldsResult = getUpdateFields({
    valid: ['title', 'attachment', 'type', 'classify', 'is_secret', 'sort', 'update_time', 'remarks'],
    data: ctx._params
  })
  const sql: string = `UPDATE sources SET ${fieldsResult.sql} WHERE id = ?`
  const data = [...fieldsResult.data, ctx._params.id]
  const sqlList: SQLOptions[] = [{ sql, data }]
  // 如果是 701 ，同步静态资源公开性
  if (ctx._params.hasOwnProperty('isSecret') && ctx._params._type === '701') {
    const sql1: string =
      'UPDATE files_info t1 SET t1.is_secret = ? WHERE FIND_IN_SET(t1.id, (SELECT t2.attachment FROM sources t2 WHERE t2.id = ?)) AND t1.create_user = ?'
    const data1 = [ctx._params.isSecret, ctx._params.id, ctx._user.id]
    sqlList.push({
      sql: sql1,
      data: data1,
      noThrow: true
    })
  }
  await execTrans(sqlList)
  throw new Success()
}
