/**
 * @description 收藏新增
 * @author chen
 * @update 2021-08-07 15:15:08
*/

import { Context, Next } from "koa";
import { Success } from '../../../utils/http-exception'
import { query } from "../../../db";
import { Terminal } from "../../../enums";
import { formatDate, getUuId } from "../../../utils/tools";

/**
 * 收藏新增
*/
export const doCollectionAdd = async (ctx: Context, next: Next) => {
  const sql: string = `INSERT collections (id, target_id, create_user, type, create_time, terminal) VALUES (?, ?, ?, ?, ?, ?)`
  const data = [getUuId(), ctx.params.targetId, ctx.user.id, ctx.params.type, formatDate(new Date()), Terminal[ctx.terminal]]
  await query(sql, data)
  throw new Success();
}