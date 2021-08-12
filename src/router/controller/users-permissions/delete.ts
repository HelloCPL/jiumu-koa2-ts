/**
 * @description 用户-权限关联额外权限删除
 * @author chen
 * @update 2021-08-07 15:15:08
*/

import { Context, Next } from "koa";
import { Success } from '../../../utils/http-exception'
import { query } from "../../../db";

/**
 * 用户-权限关联额外权限删除
*/
export const doUserPermissionDelete = async (ctx: Context, next: Next) => {
  const sql: string = `DELETE FROM users_permissions WHERE id = ?`
  await query(sql, ctx.params.id)
  throw new Success();
}