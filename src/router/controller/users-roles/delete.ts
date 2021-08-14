/**
 * @description 用户-角色关联删除
 * @author chen
 * @update 2021-08-07 15:15:08
*/

import { Context, Next } from "koa";
import { Success } from '../../../utils/http-exception'
import { query } from "../../../db";

/**
 * 用户-角色关联删除
*/
export const doUserRoleDelete = async (ctx: Context, next: Next) => {
  const sql: string = `DELETE FROM users_roles WHERE id = ?`
  await query(sql, ctx.params.id)
  throw new Success();
}
