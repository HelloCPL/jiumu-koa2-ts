/**
 * @description 角色-权限关联新增
 * @author chen
 * @update 2021-08-07 15:15:08
*/

import { Context, Next } from "koa";
import { Success } from '../../../utils/http-exception'
import { query } from "../../../db";
import { Terminal } from "../../../enums";
import { formatDate, getUuId } from "../../../utils/tools";

/**
 * 角色-权限关联新增
*/
export const doRolePermissionAdd = async (ctx: Context, next: Next) => {
  const sql: string = `INSERT roles_permissions (id, role_id, permission_id, create_time, terminal) VALUES (?, ?, ?, ?, ?)`
  const data = [getUuId(), ctx.params.roleId, ctx.params.permissionId, formatDate(new Date()), Terminal[ctx.terminal]]
  await query(sql, data)
  throw new Success();
}
