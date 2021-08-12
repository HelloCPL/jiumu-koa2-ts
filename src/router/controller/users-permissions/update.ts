/**
 * @description 修改用户-权限关联额外权限
 * @author chen
 * @update 2021-08-07 15:15:08
*/

import { Context, Next } from "koa";
import { Success } from '../../../utils/http-exception'
import { query } from "../../../db";
import { formatDate } from "../../../utils/tools";
import { getUpdateSetData } from '../../../utils/handle-sql'

/**
 * 修改用户-权限关联额外权限
*/
export const doUserPermissionUpdate = async (ctx: Context, next: Next) => {
  ctx.params.updateTime = formatDate(new Date())
  const sqlParams = getUpdateSetData({
    valid: ['userId', 'permissionId', 'status', 'update_time', 'remarks'],
    data: ctx.params
  })
  const sql: string = `UPDATE users_permissions SET ${sqlParams.sql} WHERE id = ?`
  const data = [...sqlParams.data, ctx.params.id]
  await query(sql, data)
  throw new Success();
}