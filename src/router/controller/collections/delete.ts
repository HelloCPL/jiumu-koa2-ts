/**
 * @description 收藏删除
 * @author chen
 * @update 2021-08-07 15:15:08
*/

import { Context, Next } from "koa";
import { Success } from '../../../utils/http-exception'
import { query } from "../../../db";

/**
 * 收藏删除
*/
export const doCollectionDelete = async (ctx: Context, next: Next) => {
  const sql: string = `DELETE FROM collections WHERE target_id = ? AND create_user = ?`
  const data = [ctx.params.targetId, ctx.user.id]
  await query(sql, data)
  throw new Success();
}