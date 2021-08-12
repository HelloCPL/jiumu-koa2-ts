/**
 * @description 权限删除
 * @author chen
 * @update 2021-08-07 15:15:08
*/

import { Context, Next } from "koa";
import { Success } from '../../../utils/http-exception'
import { query } from "../../../db";

/**
 * 权限删除
*/
export const doPermissionDelete = async (ctx: Context, next: Next) => {
  const sql: string = `DELETE FROM permissions WHERE id = ?`
  await query(sql, ctx.params.id)
  throw new Success();
}