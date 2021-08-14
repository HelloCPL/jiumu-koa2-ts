/**
 * @description 用户-角色关联新增
 * @author chen
 * @update 2021-08-07 15:15:08
*/

import { Context, Next } from "koa";
import { Success } from '../../../utils/http-exception'
import { query } from "../../../db";
import { Terminal } from "../../../enums";
import { formatDate, getUuId } from "../../../utils/tools";

/**
 * 用户-角色关联新增
*/
export const doUserRoleAdd = async (ctx: Context, next: Next) => {
  const sql: string = `INSERT users_roles (id, role_id, user_id, create_time, terminal) VALUES (?, ?, ?, ?, ?)`
  const data = [getUuId(), ctx.params.roleId, ctx.params.userId, formatDate(new Date()), Terminal[ctx.terminal]]
  await query(sql, data)
  throw new Success();
}
