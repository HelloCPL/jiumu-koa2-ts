/**
 * @description 资源修改
 * @author chen
 * @update 2021-08-07 15:15:08
 */

import { Context, Next } from 'koa'
import { Success } from '@/utils/http-exception'
import { execTrans } from '@/db'
import { formatDate } from '@/utils/tools'
import { getUpdateSetData } from '@/utils/handle-sql'
import { SQLOptions } from '@/db/interface'

/**
 * 资源修改
 */
export const doSourceUpdate = async (ctx: Context, next: Next) => {
  ctx._params.updateTime = formatDate(new Date())
  const sqlParams = getUpdateSetData({
    valid: ['title', 'attachment', 'type', 'classify', 'is_secret', 'sort', 'update_time', 'remarks'],
    data: ctx._params
  })
  const sql: string = `UPDATE sources SET ${sqlParams.sql} WHERE id = ?`
  const data = [...sqlParams.data, ctx._params.id]
  let sqlList: SQLOptions[] = [{ sql, data }]
  if (ctx._params.hasOwnProperty('isSecret') && ctx._params._type === '701') {
    const sql1: string = `UPDATE files_info t1 SET t1.is_secret = ? WHERE FIND_IN_SET(t1.id, (SELECT t2.attachment FROM sources t2 WHERE t2.id = ?)) AND t1.create_user = ?`
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
