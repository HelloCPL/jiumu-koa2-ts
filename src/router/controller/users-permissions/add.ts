/**
 * @description 新增用户-权限关联额外权限
 * @author chen
 * @update 2021-08-07 15:15:08
*/

import { Context, Next } from "koa";
import { Success } from '../../../utils/http-exception'
import { query } from "../../../db";
import { Terminal } from "../../../enums";
import { formatDate, getUuId } from "../../../utils/tools";

/**
 * 新增用户-权限关联额外权限
*/
export const doUserPermissionAdd = async (ctx: Context, next: Next) => {
  const currentTime = formatDate(new Date())
  const sql: string = `INSERT users_permissions (id, user_id, permission_id, status, create_time, update_time, terminal, remarks) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
  const data = [getUuId(), ctx.params.userId, ctx.params.permissionId, ctx.params.status, currentTime, currentTime, Terminal[ctx.terminal], ctx.params.remarks]
  await query(sql, data)
  throw new Success();
}